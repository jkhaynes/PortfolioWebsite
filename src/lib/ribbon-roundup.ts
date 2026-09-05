export const BEST_SCORE_KEY = "jessbuilds-ribbon-roundup-best-v1";
export const ROUND_SECONDS = 30;
export const CATCH_Y = 83;
export type GameMode = "timed" | "practice";
export type GameStatus = "ready" | "running" | "paused" | "finished";
export type Ribbon = { id: number; x: number; y: number; bonus: boolean };
export type GameState = {
  status: GameStatus;
  mode: GameMode;
  elapsed: number;
  playerX: number;
  score: number;
  ribbons: Ribbon[];
  nextSpawn: number;
  nextId: number;
  bonusAt: number | null;
  shinyUntil: number;
  bonusesCaught: number;
};

export function readyGame(): GameState {
  return {
    status: "ready",
    mode: "timed",
    elapsed: 0,
    playerX: 50,
    score: 0,
    ribbons: [],
    nextSpawn: 0.6,
    nextId: 0,
    bonusAt: null,
    shinyUntil: 0,
    bonusesCaught: 0,
  };
}

export function startGame(mode: GameMode, random = Math.random): GameState {
  return {
    ...readyGame(),
    status: "running",
    mode,
    bonusAt: random() < 0.4 ? 10 + random() * 8 : null,
  };
}

export function pauseGame(state: GameState): GameState {
  return state.status === "running" ? { ...state, status: "paused" } : state;
}

export function resumeGame(state: GameState): GameState {
  return state.status === "paused" ? { ...state, status: "running" } : state;
}

export function parseBestScore(raw: string | null): number {
  if (raw === null || !/^\d+$/.test(raw)) return 0;
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : 0;
}

export function movePlayer(state: GameState, x: number): GameState {
  if (state.status !== "running" || !Number.isFinite(x)) return state;
  return { ...state, playerX: Math.max(9, Math.min(91, x)) };
}

// Positions use percentages of the field. Fixed substeps prevent tunneling and
// keep collision/spawn results stable across display refresh rates.
export function advanceGame(
  state: GameState,
  seconds: number,
  direction: number,
  random = Math.random,
): GameState {
  if (state.status !== "running" || !Number.isFinite(seconds) || seconds <= 0)
    return state;
  const next = {
    ...state,
    ribbons: state.ribbons.map((ribbon) => ({ ...ribbon })),
  };
  let remaining =
    state.mode === "timed"
      ? Math.min(seconds, ROUND_SECONDS - state.elapsed)
      : seconds;
  while (remaining > 0.000001) {
    const dt = Math.min(remaining, 1 / 120);
    remaining -= dt;
    next.elapsed += dt;
    next.playerX = Math.max(
      9,
      Math.min(91, next.playerX + Math.sign(direction) * 65 * dt),
    );
    if (next.elapsed >= next.nextSpawn) {
      next.ribbons.push({
        id: next.nextId++,
        x: 10 + random() * 80,
        y: -5,
        bonus: false,
      });
      next.nextSpawn += state.mode === "practice" ? 1.4 : 0.8;
    }
    if (next.bonusAt !== null && next.elapsed >= next.bonusAt) {
      next.ribbons.push({
        id: next.nextId++,
        x: 10 + random() * 80,
        y: -5,
        bonus: true,
      });
      next.bonusAt = null;
    }
    next.ribbons = next.ribbons.filter((ribbon) => {
      const previousY = ribbon.y;
      ribbon.y += (state.mode === "practice" ? 18 : 27) * dt;
      if (previousY < CATCH_Y && ribbon.y >= CATCH_Y) {
        if (Math.abs(ribbon.x - next.playerX) <= 11) {
          next.score += ribbon.bonus ? 50 : 10;
          if (ribbon.bonus) {
            next.shinyUntil = next.elapsed + 5;
            next.bonusesCaught++;
          }
        }
        return false;
      }
      return true;
    });
  }
  if (next.mode === "timed" && next.elapsed >= ROUND_SECONDS - 0.000001) {
    next.elapsed = ROUND_SECONDS;
    next.status = "finished";
  }
  return next;
}
