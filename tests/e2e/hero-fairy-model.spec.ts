import { expect, test } from "@playwright/test";
import {
  IDLE_MS,
  INTRO_MS,
  SETTLE_MS,
  TRAIL_MS,
  createFairy,
  isAnimating,
  stepFairy,
  type Fairy,
  type FairyInput,
} from "../../src/lib/hero-fairy";

const rest = { x: 600, y: 120 };
const never = Number.NEGATIVE_INFINITY;

function input(now: number, extra: Partial<FairyInput> = {}): FairyInput {
  return {
    now,
    pointer: null,
    pointerInside: false,
    lastPointerMove: never,
    visible: true,
    rest,
    still: false,
    random: () => 0.5,
    ...extra,
  };
}

/** Steps the fairy every 16 ms from `from` to `to` (inclusive of `to`). */
function run(
  fairy: Fairy,
  from: number,
  to: number,
  extra: (now: number) => Partial<FairyInput> = () => ({}),
): Fairy {
  let current = fairy;
  for (let now = from; now < to; now += 16) {
    current = stepFairy(current, input(now, extra(now)));
  }
  return stepFairy(current, input(to, extra(to)));
}

/** A pointer that moves at `moveAt` and sits at (200, 200). */
function pointerAt(moveAt: number) {
  return {
    pointer: { x: 200, y: 200 },
    pointerInside: true,
    lastPointerMove: moveAt,
  };
}

test("constants match the spec", () => {
  expect(INTRO_MS).toBe(4500);
  expect(IDLE_MS).toBe(1500);
  expect(SETTLE_MS).toBe(1500);
  expect(TRAIL_MS).toBe(1100);
});

test("still always rests at the rest point with an empty trail", () => {
  const fairy = createFairy({ now: 0, rest, still: true });
  expect(fairy.state).toBe("resting");
  expect([fairy.x, fairy.y]).toEqual([rest.x, rest.y]);
  const next = run(fairy, 0, 3000, (now) => ({
    still: true,
    ...pointerAt(now),
  }));
  expect(next.state).toBe("resting");
  expect([next.x, next.y]).toEqual([rest.x, rest.y]);
  expect(next.trail).toEqual([]);
});

test("still overrides a moving fairy", () => {
  const moving = run(createFairy({ now: 0, rest, still: false }), 0, 800, (n) =>
    pointerAt(n),
  );
  expect(moving.state).toBe("following");
  const next = stepFairy(
    moving,
    input(900, { still: true, ...pointerAt(900) }),
  );
  expect(next.state).toBe("resting");
  expect([next.x, next.y]).toEqual([rest.x, rest.y]);
  expect(next.trail).toEqual([]);
});

test("intro drifts, then rests at the rest point by INTRO_MS without a pointer", () => {
  const start = createFairy({ now: 0, rest, still: false });
  expect(start.state).toBe("intro");
  expect(isAnimating(start.state)).toBe(true);

  const mid = run(start, 0, 2000);
  expect(mid.state).toBe("intro");

  const settling = run(start, 0, INTRO_MS - SETTLE_MS + 500);
  expect(settling.state).toBe("settling");

  const atBudget = run(start, 0, INTRO_MS);
  expect(atBudget.state).toBe("resting");
  expect([atBudget.x, atBudget.y]).toEqual([rest.x, rest.y]);

  const later = run(start, 0, 5000);
  expect(later.state).toBe("resting");
  expect([later.x, later.y]).toEqual([rest.x, rest.y]);
  expect(later.trail).toEqual([]);
});

test("intro reaches resting even when frames are far apart", () => {
  const start = createFairy({ now: 0, rest, still: false });
  expect(stepFairy(start, input(4500)).state).toBe("resting");
  expect(stepFairy(start, input(9000)).state).toBe("resting");
});

test("a pointer move gives following, which chases the pointer", () => {
  const start = createFairy({ now: 0, rest, still: false });
  const next = run(start, 0, 1000, (now) => pointerAt(now));
  expect(next.state).toBe("following");
  // The mockup bobs the fairy by up to about 5 px while it chases.
  expect(Math.abs(next.x - 214)).toBeLessThan(6);
  expect(Math.abs(next.y - 188)).toBeLessThan(6);
});

test("a pointer move wakes a resting fairy", () => {
  const resting = run(createFairy({ now: 0, rest, still: false }), 0, 5000);
  expect(resting.state).toBe("resting");
  const next = stepFairy(resting, input(6000, pointerAt(6000)));
  expect(next.state).toBe("following");
  expect(next.stateSince).toBe(6000);
});

test("following is frame-rate independent", () => {
  const start = createFairy({ now: 0, rest, still: false });
  const fast = run(start, 0, 640, (n) => pointerAt(n));
  let slow = start;
  for (let now = 0; now < 640; now += 64)
    slow = stepFairy(slow, input(now, pointerAt(now)));
  slow = stepFairy(slow, input(640, pointerAt(640)));
  expect(Math.abs(fast.x - slow.x)).toBeLessThan(15);
});

test("IDLE_MS after the last move the fairy settles, then rests within SETTLE_MS", () => {
  const moveAt = 1000;
  const following = run(
    createFairy({ now: 0, rest, still: false }),
    0,
    1000,
    (n) => pointerAt(Math.min(n, moveAt)),
  );
  expect(following.state).toBe("following");
  const stillPointer = () => pointerAt(moveAt);
  const justBefore = stepFairy(
    following,
    input(moveAt + IDLE_MS - 1, stillPointer()),
  );
  expect(justBefore.state).toBe("following");
  const settling = stepFairy(
    justBefore,
    input(moveAt + IDLE_MS, stillPointer()),
  );
  expect(settling.state).toBe("settling");
  expect(settling.stateSince).toBe(moveAt + IDLE_MS);
  const resting = run(
    settling,
    moveAt + IDLE_MS,
    moveAt + IDLE_MS + SETTLE_MS,
    stillPointer,
  );
  expect(resting.state).toBe("resting");
  expect([resting.x, resting.y]).toEqual([rest.x, rest.y]);
});

test("settling eases toward rest and snaps when SETTLE_MS has elapsed", () => {
  const following = run(
    createFairy({ now: 0, rest, still: false }),
    0,
    1000,
    (n) => pointerAt(n),
  );
  const settling = stepFairy(following, input(1000, { pointerInside: false }));
  expect(settling.state).toBe("settling");
  const half = stepFairy(
    settling,
    input(1000 + SETTLE_MS / 2, { pointerInside: false }),
  );
  expect(half.state).toBe("settling");
  const before = Math.hypot(settling.x - rest.x, settling.y - rest.y);
  const middle = Math.hypot(half.x - rest.x, half.y - rest.y);
  expect(middle).toBeLessThan(before);
  expect(middle).toBeGreaterThan(0);
  const done = stepFairy(
    half,
    input(1000 + SETTLE_MS, { pointerInside: false }),
  );
  expect(done.state).toBe("resting");
  expect([done.x, done.y]).toEqual([rest.x, rest.y]);
});

test("pointer leaving the hero settles the fairy immediately", () => {
  const following = run(
    createFairy({ now: 0, rest, still: false }),
    0,
    500,
    (n) => pointerAt(n),
  );
  const next = stepFairy(
    following,
    input(516, {
      pointer: { x: 200, y: 200 },
      pointerInside: false,
      lastPointerMove: 500,
    }),
  );
  expect(next.state).toBe("settling");
});

test("a pointer move during settling resumes following", () => {
  const following = run(
    createFairy({ now: 0, rest, still: false }),
    0,
    500,
    (n) => pointerAt(n),
  );
  const settling = stepFairy(following, input(600, { pointerInside: false }));
  expect(settling.state).toBe("settling");
  const next = stepFairy(settling, input(700, pointerAt(700)));
  expect(next.state).toBe("following");
});

test("self-started motion never lasts longer than 5 seconds", () => {
  const moveAt = 1000;
  let fairy = run(createFairy({ now: 0, rest, still: false }), 0, moveAt, (n) =>
    pointerAt(n),
  );
  let selfMoving = 0;
  for (let now = moveAt + 16; now <= moveAt + 6000; now += 16) {
    fairy = stepFairy(fairy, input(now, pointerAt(moveAt)));
    if (fairy.state === "following" || fairy.state === "settling")
      selfMoving = now - moveAt;
  }
  expect(selfMoving).toBeLessThanOrEqual(5000);
  expect(fairy.state).toBe("resting");
});

test("not visible gives paused from any state, and visible again gives resting", () => {
  const states: Fairy[] = [
    createFairy({ now: 0, rest, still: false }),
    run(createFairy({ now: 0, rest, still: false }), 0, 500, (n) =>
      pointerAt(n),
    ),
    stepFairy(
      run(createFairy({ now: 0, rest, still: false }), 0, 500, (n) =>
        pointerAt(n),
      ),
      input(600, { pointerInside: false }),
    ),
    run(createFairy({ now: 0, rest, still: false }), 0, 5000),
  ];
  for (const fairy of states) {
    const paused = stepFairy(
      fairy,
      input(5100, { visible: false, ...pointerAt(5100) }),
    );
    expect(paused.state).toBe("paused");
    expect(paused.trail).toEqual([]);
    expect(isAnimating(paused.state)).toBe(false);
    const back = stepFairy(paused, input(5200));
    expect(back.state).toBe("resting");
    expect([back.x, back.y]).toEqual([rest.x, rest.y]);
  }
});

test("sparkles are added at most every 40 ms and expire after TRAIL_MS", () => {
  const following = run(
    createFairy({ now: 0, rest, still: false }),
    0,
    400,
    (n) => pointerAt(n),
  );
  expect(following.trail.length).toBeGreaterThan(0);
  const spacing = following.trail.map((s) => s.born).sort((a, b) => a - b);
  for (let i = 1; i < spacing.length; i++) {
    expect(spacing[i] - spacing[i - 1]).toBeGreaterThanOrEqual(40);
  }
  for (const spark of following.trail) {
    expect(spark).toEqual(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        born: expect.any(Number),
        size: expect.any(Number),
        hue: expect.any(Number),
      }),
    );
  }
  const newest = Math.max(...spacing);
  const aged = stepFairy(
    following,
    input(newest + TRAIL_MS, pointerAt(newest + TRAIL_MS)),
  );
  expect(
    aged.trail.every(
      (s) => aged.stateSince >= 0 && newest + TRAIL_MS - s.born < TRAIL_MS,
    ),
  ).toBe(true);
});

test("the trail is empty in resting", () => {
  const resting = run(
    createFairy({ now: 0, rest, still: false }),
    0,
    6000,
    (n) => (n < 800 ? pointerAt(n) : { pointerInside: false }),
  );
  expect(resting.state).toBe("resting");
  expect(resting.trail).toEqual([]);
});

test("stepFairy does not mutate its input", () => {
  const fairy = run(createFairy({ now: 0, rest, still: false }), 0, 400, (n) =>
    pointerAt(n),
  );
  const snapshot = JSON.stringify(fairy);
  const inp = input(500, pointerAt(500));
  const inpSnapshot = JSON.stringify({ ...inp, random: undefined });
  const next = stepFairy(fairy, inp);
  expect(next).not.toBe(fairy);
  expect(JSON.stringify(fairy)).toBe(snapshot);
  expect(JSON.stringify({ ...inp, random: undefined })).toBe(inpSnapshot);
});

test("isAnimating is true only for intro, following and settling", () => {
  expect(isAnimating("intro")).toBe(true);
  expect(isAnimating("following")).toBe(true);
  expect(isAnimating("settling")).toBe(true);
  expect(isAnimating("resting")).toBe(false);
  expect(isAnimating("paused")).toBe(false);
});
