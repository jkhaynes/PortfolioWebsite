"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import {
  advanceGame,
  BEST_SCORE_KEY,
  movePlayer,
  parseBestScore,
  pauseGame,
  readyGame,
  resumeGame,
  ROUND_SECONDS,
  startGame,
  type GameMode,
  type GameState,
} from "@/lib/ribbon-roundup";
import "./ribbon-roundup.css";

function readBest() {
  try {
    return parseBestScore(localStorage.getItem(BEST_SCORE_KEY));
  } catch {
    return 0;
  }
}

export default function RibbonRoundup() {
  const [game, setGame] = useState(readyGame);
  const model = useRef(game);
  const [best, setBest] = useState(readBest);
  const bestRef = useRef(best);
  const field = useRef<HTMLDivElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const keys = useRef(new Set<string>());
  const heldDirection = useRef(0);
  const dragging = useRef<number | null>(null);
  const descriptionId = useId();

  function clearInput() {
    keys.current.clear();
    heldDirection.current = 0;
    dragging.current = null;
  }
  function publish(next: GameState) {
    model.current = next;
    setGame(next);
  }
  function start(mode: GameMode) {
    clearInput();
    publish(startGame(mode));
    field.current?.focus();
  }
  function pause() {
    clearInput();
    publish(pauseGame(model.current));
  }
  function resume() {
    clearInput();
    publish(resumeGame(model.current));
    field.current?.focus();
  }

  useEffect(() => {
    if (game.status !== "running") return;
    let frame = 0;
    let previous: number | null = null;
    const tick = (time: number) => {
      if (model.current.status !== "running") return;
      const delta = previous === null ? 0 : (time - previous) / 1000;
      previous = time;
      const direction =
        heldDirection.current ||
        Number(keys.current.has("ArrowRight")) -
          Number(keys.current.has("ArrowLeft"));
      const next = advanceGame(model.current, delta, direction);
      model.current = next;
      setGame(next);
      if (next.status === "finished") {
        const value = Math.max(bestRef.current, readBest(), next.score);
        bestRef.current = value;
        try {
          localStorage.setItem(BEST_SCORE_KEY, String(value));
        } catch {}
        setBest(value);
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [game.status]);

  useEffect(() => {
    function stopForBackground() {
      keys.current.clear();
      heldDirection.current = 0;
      dragging.current = null;
      model.current = pauseGame(model.current);
      setGame(model.current);
    }
    const onVisibility = () => {
      if (document.hidden) stopForBackground();
    };
    window.addEventListener("blur", stopForBackground);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", stopForBackground);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (game.status === "finished") replay.current?.focus();
  }, [game.status]);

  function drag(event: PointerEvent<HTMLDivElement>) {
    if (dragging.current !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    publish(
      movePlayer(
        model.current,
        ((event.clientX - rect.left) / rect.width) * 100,
      ),
    );
  }
  const shiny = game.shinyUntil > game.elapsed;
  const running = game.status === "running";
  const message =
    game.status === "ready"
      ? "Choose a timed round or relaxed practice."
      : game.status === "paused"
        ? "Paused. Resume when you’re ready."
        : game.status === "finished"
          ? `${game.mode === "practice" ? "Practice complete" : "Round complete"}. Final score: ${game.score}.`
          : shiny
            ? "Shiny bonus! 50 points and a little blue magic."
            : "Catch the pink ribbons!";

  return (
    <div className="roundup-game">
      <p id={descriptionId} className="roundup-instructions">
        Catch pink ribbons for 10 points. A rare sparkling blue ribbon gives 50
        points and five seconds of shiny Sylveon. Focus the play area and use ←
        →, hold the buttons, or drag Sylveon.
      </p>
      <div className="roundup-stats">
        <span>
          Score <strong data-testid="roundup-score">{game.score}</strong>
        </span>
        <span>
          {game.mode === "practice" ? (
            "Untimed practice"
          ) : (
            <>
              Time{" "}
              <strong data-testid="roundup-time">
                {Math.ceil(ROUND_SECONDS - game.elapsed)}s
              </strong>
            </>
          )}
        </span>
      </div>
      <div
        ref={field}
        className="roundup-field"
        tabIndex={0}
        role="region"
        aria-label="Ribbon catching play area"
        aria-describedby={descriptionId}
        data-status={game.status}
        onKeyDown={(event) => {
          if (!running || !["ArrowLeft", "ArrowRight"].includes(event.key))
            return;
          event.preventDefault();
          keys.current.add(event.key);
        }}
        onKeyUp={(event) => {
          if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            keys.current.delete(event.key);
          }
        }}
        onBlur={clearInput}
        onPointerDown={(event) => {
          if (!running || !event.isPrimary) return;
          event.currentTarget.focus();
          dragging.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag(event);
        }}
        onPointerMove={drag}
        onPointerUp={() => {
          dragging.current = null;
        }}
        onPointerCancel={clearInput}
        onLostPointerCapture={() => {
          dragging.current = null;
        }}
      >
        <div className="roundup-field__decor" aria-hidden="true" />
        {game.ribbons.map((ribbon) => (
          <span
            key={ribbon.id}
            className="roundup-ribbon"
            aria-hidden="true"
            style={{ left: `${ribbon.x}%`, top: `${ribbon.y}%` }}
          >
            <Image
              unoptimized
              src={`/images/pokemon/ribbon-${ribbon.bonus ? "blue" : "pink"}.svg`}
              alt=""
              width={36}
              height={36}
            />
          </span>
        ))}
        <div
          className="roundup-player"
          aria-hidden="true"
          data-shiny={shiny}
          style={{ left: `${game.playerX}%` }}
        >
          <Image
            unoptimized
            loading="eager"
            src="/images/pokemon/sylveon-sprite.png"
            alt=""
            width={96}
            height={96}
            style={{ visibility: shiny ? "hidden" : "visible" }}
          />
          <Image
            unoptimized
            loading="eager"
            src="/images/pokemon/sylveon-shiny-sprite.png"
            alt=""
            width={96}
            height={96}
            className="roundup-player__shiny"
            style={{ visibility: shiny ? "visible" : "hidden" }}
          />
        </div>
        {game.status !== "running" && (
          <div className="roundup-field__label" aria-hidden="true">
            {game.status === "ready"
              ? "A little play break"
              : game.status === "paused"
                ? "Paused"
                : "Nicely caught!"}
          </div>
        )}
      </div>
      <p role="status" className="roundup-status">
        {message}
      </p>
      <div className="roundup-controls">
        {game.status === "ready" && (
          <>
            <button
              ref={startButton}
              type="button"
              className="roundup-button roundup-button--primary"
              onClick={() => start("timed")}
            >
              Start 30-second round
            </button>
            <button
              type="button"
              className="roundup-button"
              onClick={() => start("practice")}
            >
              Untimed practice
            </button>
          </>
        )}
        {(running || game.status === "paused") && (
          <>
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                className="roundup-button roundup-move"
                disabled={!running}
                aria-label={direction === -1 ? "Move left" : "Move right"}
                onPointerDown={(event) => {
                  event.currentTarget.focus();
                  heldDirection.current = direction;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerUp={() => {
                  heldDirection.current = 0;
                }}
                onLostPointerCapture={() => {
                  heldDirection.current = 0;
                }}
                onPointerCancel={clearInput}
                onBlur={clearInput}
                onClick={(event) => {
                  if (event.detail === 0)
                    publish(
                      movePlayer(
                        model.current,
                        model.current.playerX + direction * 12,
                      ),
                    );
                }}
              >
                {direction === -1 ? "←" : "→"}
              </button>
            ))}
            <button
              type="button"
              className="roundup-button"
              onClick={running ? pause : resume}
            >
              {running ? "Pause" : "Resume"}
            </button>
            {game.mode === "practice" && (
              <button
                type="button"
                className="roundup-button"
                onClick={() => {
                  clearInput();
                  publish({ ...model.current, status: "finished" });
                }}
              >
                Finish practice
              </button>
            )}
          </>
        )}
        {game.status === "finished" && (
          <>
            <button
              ref={replay}
              type="button"
              className="roundup-button roundup-button--primary"
              onClick={() => start(game.mode)}
            >
              Play again
            </button>
            <button
              type="button"
              className="roundup-button"
              onClick={() => {
                publish(readyGame());
                requestAnimationFrame(() => startButton.current?.focus());
              }}
            >
              Change game mode
            </button>
          </>
        )}
      </div>
      <p className="roundup-best">
        Timed personal best: <strong>{best}</strong>
      </p>
      {game.mode === "practice" && (
        <p className="roundup-best">
          Slower ribbons, no countdown. Practice doesn’t change your personal
          best.
        </p>
      )}
    </div>
  );
}
