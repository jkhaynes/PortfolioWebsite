export type FairyState =
  "intro" | "following" | "settling" | "resting" | "paused";
export type FairyKind = "butterfly" | "ribbon";

/** Total self-started intro budget: drift, then settle at the rest point. */
export const INTRO_MS = 4500;
/** The pointer counts as stopped this long after its last move. */
export const IDLE_MS = 1500;
/** How long settling takes to reach the rest point. */
export const SETTLE_MS = 1500;
/** How long a sparkle lives. */
export const TRAIL_MS = 1100;

const SPARKLE_EVERY_MS = 40;
const SPARKLE_MIN_DISTANCE = 2;
const FRAME_MS = 1000 / 60;
const CHASE_PER_FRAME = 0.08;
const POINTER_OFFSET = { x: 14, y: -12 };

export type Point = { x: number; y: number };
export type Sparkle = {
  x: number;
  y: number;
  born: number;
  size: number;
  hue: number;
};
export type Drift = { cx: number; cy: number; span: number };

export type Fairy = {
  state: FairyState;
  x: number;
  y: number;
  /** When the current state was entered. */
  stateSince: number;
  trail: Sparkle[];
  kind: FairyKind;
  /** The time of the previous step, for frame-rate independent movement. */
  updatedAt: number;
  /** The time the last sparkle was added. */
  lastSpark: number;
  /** Where settling began. */
  fromX: number;
  fromY: number;
};

export type FairyInput = {
  now: number;
  /** The latest mouse position in hero CSS pixels, or null. */
  pointer: Point | null;
  pointerInside: boolean;
  /** The time of the last mouse move over the hero. */
  lastPointerMove: number;
  visible: boolean;
  rest: Point;
  still: boolean;
  /** The intro path center and half-width. Defaults to centered on `rest`. */
  drift?: Drift;
  /** For sparkle jitter. Defaults to Math.random. */
  random?: () => number;
};

export function isAnimating(state: FairyState): boolean {
  return state === "intro" || state === "following" || state === "settling";
}

function driftTarget(drift: Drift, elapsed: number): Point {
  return {
    x: drift.cx + Math.sin(elapsed * 0.00045) * drift.span,
    y: drift.cy + Math.sin(elapsed * 0.0009) * 34,
  };
}

function defaultDrift(rest: Point): Drift {
  return { cx: rest.x, cy: rest.y, span: 120 };
}

export function createFairy({
  now,
  rest,
  still,
  kind = "butterfly",
  drift,
}: {
  now: number;
  rest: Point;
  still: boolean;
  kind?: FairyKind;
  drift?: Drift;
}): Fairy {
  const start = still ? rest : driftTarget(drift ?? defaultDrift(rest), 0);
  return {
    state: still ? "resting" : "intro",
    x: start.x,
    y: start.y,
    stateSince: now,
    trail: [],
    kind,
    updatedAt: now,
    lastSpark: Number.NEGATIVE_INFINITY,
    fromX: start.x,
    fromY: start.y,
  };
}

function enter(fairy: Fairy, state: FairyState, at: number): Fairy {
  return fairy.state === state
    ? fairy
    : { ...fairy, state, stateSince: at, fromX: fairy.x, fromY: fairy.y };
}

function atRest(
  fairy: Fairy,
  state: FairyState,
  now: number,
  rest: Point,
): Fairy {
  return {
    ...enter(fairy, state, now),
    x: rest.x,
    y: rest.y,
    trail: [],
    updatedAt: now,
  };
}

/** Chases a target, adds sparkles, and expires old ones. */
function chase(
  fairy: Fairy,
  target: Point,
  now: number,
  random: () => number,
): Fairy {
  const dt = Math.max(0, now - fairy.updatedAt);
  const k = 1 - Math.pow(1 - CHASE_PER_FRAME, dt / FRAME_MS);
  const dx = target.x - fairy.x;
  const dy = target.y - fairy.y;
  const x = fairy.x + dx * k;
  const y = fairy.y + dy * k + Math.sin(now * 0.006) * 0.4 * (dt / FRAME_MS);
  let trail = fairy.trail;
  let lastSpark = fairy.lastSpark;
  if (
    now - lastSpark > SPARKLE_EVERY_MS &&
    Math.hypot(dx, dy) > SPARKLE_MIN_DISTANCE
  ) {
    lastSpark = now;
    trail = [
      ...trail,
      {
        x: x - Math.sign(dx || 1) * 6,
        y: y + 8,
        born: now,
        size: 2 + random() * 3,
        hue: random(),
      },
    ];
  }
  return {
    ...fairy,
    x,
    y,
    lastSpark,
    trail: trail.filter((s) => now - s.born < TRAIL_MS),
    updatedAt: now,
  };
}

function settle(fairy: Fairy, now: number, rest: Point): Fairy {
  const elapsed = now - fairy.stateSince;
  if (elapsed >= SETTLE_MS) return atRest(fairy, "resting", now, rest);
  const p = 1 - Math.pow(1 - Math.max(0, elapsed) / SETTLE_MS, 3);
  return {
    ...fairy,
    x: fairy.fromX + (rest.x - fairy.fromX) * p,
    y: fairy.fromY + (rest.y - fairy.fromY) * p,
    trail: fairy.trail.filter((s) => now - s.born < TRAIL_MS),
    updatedAt: now,
  };
}

/** Returns the next fairy. Never mutates `fairy` or `input`. */
export function stepFairy(fairy: Fairy, input: FairyInput): Fairy {
  const { now, pointer, pointerInside, lastPointerMove, visible, rest, still } =
    input;
  const random = input.random ?? Math.random;

  if (still) return atRest(fairy, "resting", now, rest);
  if (!visible) {
    return { ...enter(fairy, "paused", now), trail: [], updatedAt: now };
  }
  if (fairy.state === "paused") return atRest(fairy, "resting", now, rest);

  const wantsFollow =
    pointerInside && pointer !== null && now - lastPointerMove < IDLE_MS;
  if (wantsFollow) {
    const next = enter(fairy, "following", now);
    return chase(
      next,
      { x: pointer.x + POINTER_OFFSET.x, y: pointer.y + POINTER_OFFSET.y },
      now,
      random,
    );
  }

  let current = fairy;
  if (current.state === "following") current = enter(current, "settling", now);

  if (current.state === "intro") {
    const introMs = INTRO_MS - SETTLE_MS;
    const elapsed = now - current.stateSince;
    if (elapsed < introMs) {
      const target = driftTarget(input.drift ?? defaultDrift(rest), elapsed);
      return chase(current, target, now, random);
    }
    current = {
      ...current,
      state: "settling",
      stateSince: current.stateSince + introMs,
      fromX: current.x,
      fromY: current.y,
    };
  }

  if (current.state === "settling") return settle(current, now, rest);
  return atRest(current, "resting", now, rest);
}
