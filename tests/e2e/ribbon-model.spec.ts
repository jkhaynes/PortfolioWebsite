import { expect, test } from "@playwright/test";
import {
  advanceGame,
  movePlayer,
  parseBestScore,
  pauseGame,
  readyGame,
  resumeGame,
  startGame,
} from "../../src/lib/ribbon-roundup";

test("collisions score once, including exact catch boundary", () => {
  const state = {
    ...startGame("timed", () => 0.5),
    nextSpawn: 100,
    ribbons: [
      { id: 0, x: 61, y: 82.9, bonus: false },
      { id: 1, x: 61.1, y: 82.9, bonus: false },
    ],
  };
  const next = advanceGame(state, 0.1, 0);
  expect(next.score).toBe(10);
  expect(next.ribbons).toEqual([]);
  expect(advanceGame(next, 1, 0).score).toBe(10);
  expect(state.ribbons).toHaveLength(2);
});

test("bonus scores 50 with five seconds of cosmetic shiny form", () => {
  const state = {
    ...startGame("timed", () => 0.5),
    nextSpawn: 100,
    ribbons: [{ id: 0, x: 50, y: 82.9, bonus: true }],
  };
  const next = advanceGame(state, 0.01, 0);
  expect(next.score).toBe(50);
  expect(next.bonusesCaught).toBe(1);
  expect(next.shinyUntil - next.elapsed).toBeCloseTo(5, 2);
  const later = advanceGame(next, 5.1, 0);
  expect(later.shinyUntil).toBeLessThan(later.elapsed);
  expect(later.score).toBe(50);
});

test("the rare ribbon is optional, appears once, and has time to fall", () => {
  expect(startGame("timed", () => 0.9).bonusAt).toBeNull();
  let game = startGame("timed", () => 0.1);
  expect(game.bonusAt).toBeGreaterThanOrEqual(10);
  expect(game.bonusAt).toBeLessThanOrEqual(18);
  game = advanceGame(game, 30, 0, () => 0.5);
  expect(game.bonusesCaught).toBe(1);
  expect(game.bonusAt).toBeNull();
});

test("elapsed time is frame-rate independent and stops precisely at round end", () => {
  let fine = startGame("timed", () => 0.5);
  for (let frame = 0; frame < 1800; frame++)
    fine = advanceGame(fine, 1 / 60, 0, () => 0.5);
  const coarse = advanceGame(
    startGame("timed", () => 0.5),
    35,
    0,
    () => 0.5,
  );
  expect(fine.elapsed).toBe(30);
  expect(coarse.elapsed).toBe(30);
  expect(fine.score).toBe(coarse.score);
  expect(coarse.status).toBe("finished");
  expect(advanceGame(coarse, 10, 0)).toBe(coarse);
});

test("pause freezes progress, resume continues, replay resets", () => {
  const active = advanceGame(
    startGame("timed", () => 0.5),
    3,
    1,
    () => 0.5,
  );
  const paused = pauseGame(active);
  expect(advanceGame(paused, 60, -1)).toBe(paused);
  expect(movePlayer(paused, 10)).toBe(paused);
  const resumed = advanceGame(resumeGame(paused), 1, 0, () => 0.5);
  expect(resumed.elapsed).toBeCloseTo(4);
  expect(startGame("timed", () => 0.5)).toMatchObject({
    elapsed: 0,
    score: 0,
    playerX: 50,
    ribbons: [],
  });
  expect(advanceGame(readyGame(), 60, 1).status).toBe("ready");
});

test("practice has no deadline and movement stays inside the field", () => {
  const game = advanceGame(
    startGame("practice", () => 0.5),
    40,
    1,
    () => 0.5,
  );
  expect(game.status).toBe("running");
  expect(game.playerX).toBe(91);
  expect(movePlayer(game, -100).playerX).toBe(9);
  expect(movePlayer(game, NaN)).toBe(game);
});

test("best score rejects malformed, negative and unsafe values", () => {
  for (const raw of [
    null,
    "",
    "-1",
    "2.5",
    "NaN",
    "Infinity",
    "1e3",
    "9007199254740992",
  ])
    expect(parseBestScore(raw)).toBe(0);
  expect(parseBestScore("240")).toBe(240);
});
