"use client";

import { useEffect, useRef } from "react";
import {
  TRAIL_MS,
  createFairy,
  isAnimating,
  stepFairy,
  type Drift,
  type Fairy,
  type FairyKind,
  type Point,
} from "@/lib/hero-fairy";
import { useTheme } from "@/lib/theme-store";

type Colors = { a: string; b: string; fg: string };

const FALLBACK: Colors = { a: "#b8306f", b: "#8f5f86", fg: "#2b1f27" };
const RIBBON_TRAIL = { a: "#e58fb0", b: "#8ac6e6" };
/** How far each drawing reaches from its center (resting, at scale 1). */
const EXTENT: Record<FairyKind, { side: number; top: number; bottom: number }> =
  {
    butterfly: { side: 17, top: 16, bottom: 15 },
    ribbon: { side: 21, top: 12, bottom: 33 },
  };
/**
 * Narrow heroes shrink the butterfly rather than let it cover text. The
 * ribbon fairy is never shown below 360px (HIDE_BELOW), so it keeps one size.
 */
const SCALES: Record<FairyKind, number[]> = {
  butterfly: [1, 0.8, 0.65],
  ribbon: [1],
};
/** Pokémon shows no ribbon fairy on screens narrower than this (FR-015). */
const HIDE_QUERY = "(max-width: 359px)";
const GAP = 3;
const SEARCH_STEP = 4;
/** How far a full or reduced size fairy may move from beside the name. */
const MAX_SHIFT = 48;
/** The still fairy leans like the mockup's resting drawings (about -14deg). */
const REST_TILT = -0.24;

function spark(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + r * 0.15, y - r * 0.15, x + r, y);
  ctx.quadraticCurveTo(x + r * 0.15, y + r * 0.15, x, y + r);
  ctx.quadraticCurveTo(x - r * 0.15, y + r * 0.15, x - r, y);
  ctx.quadraticCurveTo(x - r * 0.15, y - r * 0.15, x, y - r);
  ctx.fill();
}

function butterfly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flap: number,
  tilt: number,
  col: Colors,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side * flap, 1);
    const g = ctx.createLinearGradient(0, -12, 14, 8);
    g.addColorStop(0, col.a);
    g.addColorStop(1, col.b);
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.ellipse(7, -5, 8, 6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.ellipse(5.5, 5, 5.5, 4, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(8, -6, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = col.fg;
  ctx.lineCap = "round";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.lineTo(0, 8);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.quadraticCurveTo(-2, -12, -4, -13);
  ctx.moveTo(0, -7);
  ctx.quadraticCurveTo(2, -12, 4, -13);
  ctx.stroke();
  ctx.restore();
}

function ribbon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flap: number,
  tilt: number,
  sway: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#edb0c4";
  ctx.beginPath();
  ctx.moveTo(-1, 3);
  ctx.bezierCurveTo(-6 + sway, 12, -14 - sway, 20, -10 + sway, 30);
  ctx.stroke();
  ctx.strokeStyle = "#8ac6e6";
  ctx.beginPath();
  ctx.moveTo(1, 3);
  ctx.bezierCurveTo(6 - sway, 12, 14 + sway, 20, 10 - sway, 30);
  ctx.stroke();
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side * flap, 1);
    ctx.fillStyle = "#f6cbda";
    ctx.strokeStyle = "#914560";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(9, -3, 10, 6.5, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = "#edb0c4";
  ctx.strokeStyle = "#914560";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, -1, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

type Box = { left: number; top: number; right: number; bottom: number };

const overlaps = (a: Box, b: Box) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Text near the heading, in hero coordinates, that the fairy must not cover. */
function textBoxes(heroEl: HTMLElement, heading: HTMLElement, origin: DOMRect) {
  const boxes: Box[] = [];
  const add = (r: DOMRect) => {
    if (r.width && r.height) {
      boxes.push({
        left: r.left - origin.left - GAP,
        top: r.top - origin.top - GAP,
        right: r.right - origin.left + GAP,
        bottom: r.bottom - origin.top + GAP,
      });
    }
  };
  const range = document.createRange();
  range.selectNodeContents(heading);
  add(range.getBoundingClientRect());
  for (const el of heroEl.querySelectorAll(".hero-role, .hero-tagline")) {
    range.selectNodeContents(el);
    for (const r of range.getClientRects()) add(r);
  }
  for (const el of heroEl.querySelectorAll(".hero-game > *")) {
    add(el.getBoundingClientRect());
  }
  return boxes;
}

export type Rest = { rest: Point; drift: Drift; scale: number };

/**
 * The rest point sits just right of the end of the h1 text, a little above
 * its last line's middle (as in the mockup). When that would cover text or
 * leave the hero (narrow phones), it takes the nearest clear spot around the
 * end of the name, shrinking the fairy when nothing fits close by.
 * The intro drift circles the heading.
 */
function measure(
  heroEl: HTMLElement,
  heading: HTMLElement | null,
  kind: FairyKind,
): Rest {
  const w = heroEl.clientWidth;
  const h = heroEl.clientHeight;
  const origin = heroEl.getBoundingClientRect();
  if (!heading) {
    const rest = { x: w / 2, y: Math.min(h, 200) / 2 };
    return {
      rest,
      drift: { cx: rest.x, cy: rest.y, span: w * 0.3 },
      scale: 1,
    };
  }
  const range = document.createRange();
  range.selectNodeContents(heading);
  const text = range.getBoundingClientRect();
  const lines = range.getClientRects();
  const last = lines.length ? lines[lines.length - 1] : text;
  const right = text.right - origin.left;
  const top = text.top - origin.top;
  const lastTop = last.top - origin.top;
  const drift = {
    cx: text.left - origin.left + text.width / 2,
    cy: top + text.height / 2 - 26,
    span: Math.min(w * 0.4, text.width / 2 + 90),
  };
  const preferred = { x: right + 30, y: lastTop + 20 };
  const blocked = textBoxes(heroEl, heading, origin);
  const extent = EXTENT[kind];
  const scales = SCALES[kind];

  for (const scale of scales) {
    // Stay beside the name, shrinking first; only the smallest size may
    // move further away.
    const reach =
      scale === scales[scales.length - 1]
        ? Number.POSITIVE_INFINITY
        : MAX_SHIFT;
    const side = extent.side * scale;
    const above = extent.top * scale;
    const below = extent.bottom * scale;
    const fits = (x: number, y: number) => {
      const box = {
        left: x - side,
        top: y - above,
        right: x + side,
        bottom: y + below,
      };
      return (
        box.left >= 0 &&
        box.right <= w &&
        box.top >= 0 &&
        box.bottom <= h &&
        !blocked.some((b) => overlaps(box, b))
      );
    };
    let best: Point | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    // Search a window around the end of the name for the nearest clear spot.
    for (let y = top - 80; y <= lastTop + 40; y += SEARCH_STEP) {
      for (let x = right - 90; x <= right + 60; x += SEARCH_STEP) {
        const d = Math.hypot(x - preferred.x, y - preferred.y);
        if (d <= reach && d < bestDistance && fits(x, y)) {
          best = { x, y };
          bestDistance = d;
        }
      }
    }
    // Snug against the end of the name: narrow phones may only have room
    // for this exact spot, which the grid can step over.
    const snug = { x: right + GAP + side, y: preferred.y };
    if (
      Math.hypot(snug.x - preferred.x, snug.y - preferred.y) < bestDistance &&
      fits(snug.x, snug.y)
    ) {
      best = snug;
    }
    if (fits(preferred.x, preferred.y)) best = preferred;
    if (best) return { rest: best, drift, scale };
  }
  const x = Math.max(0, Math.min(w, preferred.x));
  const y = Math.max(0, Math.min(h, preferred.y));
  return { rest: { x, y }, drift, scale: scales[scales.length - 1] };
}

const kindFor = (theme: string | null | undefined): FairyKind =>
  theme === "pokemon" ? "ribbon" : "butterfly";

export default function HeroFairy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const kind = kindFor(theme);
  const kindRef = useRef(kind);
  /** Set by the effect below: re-reads colors, re-measures and redraws. */
  const refreshRef = useRef<() => void>(() => {});

  useEffect(() => {
    kindRef.current = kind;
    refreshRef.current();
  }, [kind, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const heroEl = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !heroEl || !ctx) return;
    const heading = heroEl.querySelector("h1");
    // The first render is server-shaped (no theme yet); read the real one so a
    // narrow Pokémon page never starts, even for a frame.
    kindRef.current = kindFor(document.documentElement.dataset.theme);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(any-pointer: fine)");
    const isStill = () => reduced.matches || !fine.matches;
    const narrow = window.matchMedia(HIDE_QUERY);
    const isHidden = () => narrow.matches && kindRef.current === "ribbon";

    let { rest, drift, scale } = measure(heroEl, heading, kindRef.current);
    let colors = FALLBACK;
    let pointer: Point | null = null;
    let pointerInside = false;
    let lastPointerMove = Number.NEGATIVE_INFINITY;
    let visible = true;
    let raf = 0;
    let watchdog = 0;
    let written = { state: "", x: "", y: "" };
    let fairy: Fairy = createFairy({
      now: performance.now(),
      rest,
      still: isStill(),
      kind: kindRef.current,
      drift,
    });
    /** The last drawn x, so the fairy leans into its motion. */
    let prevX = fairy.x;

    const readColors = () => {
      const cs = getComputedStyle(heroEl);
      const get = (name: string, fallback: string) =>
        cs.getPropertyValue(name).trim() || fallback;
      colors = {
        a: get("--color-accent", FALLBACK.a),
        b: get("--color-accent-secondary", FALLBACK.b),
        fg: get("--color-foreground", FALLBACK.fg),
      };
    };

    const resize = () => {
      const w = heroEl.clientWidth;
      const h = heroEl.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.round(w * dpr);
      const bh = Math.round(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      return dpr;
    };

    const write = () => {
      const next = {
        state: fairy.state,
        x: String(Math.round(fairy.x)),
        y: String(Math.round(fairy.y)),
      };
      if (next.state !== written.state) {
        canvas.setAttribute("data-fairy-state", next.state);
      }
      if (next.x !== written.x) canvas.setAttribute("data-fairy-x", next.x);
      if (next.y !== written.y) canvas.setAttribute("data-fairy-y", next.y);
      written = next;
    };

    const draw = (now: number) => {
      const dpr = resize();
      const w = heroEl.clientWidth;
      const h = heroEl.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (fairy.state === "paused") return;
      const moving = isAnimating(fairy.state);
      const ribbonKind = kindRef.current === "ribbon";
      const trailA = ribbonKind ? RIBBON_TRAIL.a : colors.a;
      const trailB = ribbonKind ? RIBBON_TRAIL.b : colors.b;
      for (const s of fairy.trail) {
        const age = (now - s.born) / TRAIL_MS;
        ctx.globalAlpha = Math.max(0, (1 - age) * 0.85);
        ctx.fillStyle = s.hue > 0.5 ? trailA : trailB;
        spark(
          ctx,
          s.x + Math.sin(age * 6 + s.hue * 6) * 3,
          s.y + age * 18,
          s.size * (1 - age * 0.5),
        );
      }
      ctx.globalAlpha = 1;
      const vx = fairy.x - prevX;
      prevX = fairy.x;
      const tilt = moving
        ? Math.max(-0.5, Math.min(0.5, vx * 0.125))
        : REST_TILT;
      ctx.save();
      ctx.translate(fairy.x, fairy.y);
      ctx.scale(scale, scale);
      if (ribbonKind) {
        const flap = moving ? 0.78 + 0.22 * Math.abs(Math.sin(now * 0.012)) : 1;
        const sway = moving ? Math.sin(now * 0.006) * 5 : 0;
        ribbon(ctx, 0, 0, flap, tilt, sway);
      } else {
        const flap = moving ? 0.35 + 0.65 * Math.abs(Math.sin(now * 0.018)) : 1;
        butterfly(ctx, 0, 0, flap, tilt, colors);
      }
      ctx.restore();
    };

    const step = (now: number) => {
      fairy = stepFairy(
        { ...fairy, kind: kindRef.current },
        {
          now,
          pointer,
          pointerInside,
          lastPointerMove,
          visible,
          rest,
          // Still never overrides an off-screen pause.
          still: isStill() && visible,
          drift,
        },
      );
      write();
      draw(now);
    };

    /** No ribbon fairy on narrow screens: no drawing, no loop, no timer. */
    const applyHidden = (hidden: boolean) => {
      if (canvas.hidden === hidden) return;
      canvas.hidden = hidden;
      if (hidden) {
        canvas.setAttribute("data-fairy-hidden", "true");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        canvas.removeAttribute("data-fairy-hidden");
      }
    };

    const tick = (now: number) => {
      raf = 0;
      window.clearTimeout(watchdog);
      const hidden = isHidden();
      applyHidden(hidden);
      if (hidden) return;
      step(now);
      if (!isAnimating(fairy.state)) return;
      raf = requestAnimationFrame(tick);
      // Browsers can stall frames under load; a stalled loop must not leave
      // the fairy stuck mid-flight, so step on a timer if no frame comes.
      watchdog = window.setTimeout(() => {
        if (raf <= 0) return;
        cancelAnimationFrame(raf);
        raf = 0;
        tick(performance.now());
      }, 250);
    };

    /** Steps and draws once now, and keeps the loop running if animating. */
    const wake = () => {
      if (raf) return;
      tick(performance.now());
    };

    /** Re-measures the rest point; a resting fairy moves there and redraws. */
    const remeasure = () => {
      ({ rest, drift, scale } = measure(heroEl, heading, kindRef.current));
      wake();
    };

    /** After a theme change: new colors, and the new drawing's rest point. */
    const refresh = () => {
      readColors();
      remeasure();
    };
    refreshRef.current = refresh;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = heroEl.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
      pointerInside = true;
      lastPointerMove = performance.now();
      wake();
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerInside = false;
      wake();
    };
    const onVisibility = () => {
      if (!document.hidden) wake();
    };

    const intersection = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry || entry.isIntersecting === visible) return;
      visible = entry.isIntersecting;
      if (raf > 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      wake();
    });
    const resizer = new ResizeObserver(remeasure);

    readColors();
    heroEl.addEventListener("pointermove", onMove, { passive: true });
    heroEl.addEventListener("pointerleave", onLeave, { passive: true });
    reduced.addEventListener("change", wake);
    narrow.addEventListener("change", wake);
    fine.addEventListener("change", wake);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("themechange", refresh);
    intersection.observe(heroEl);
    resizer.observe(heroEl);
    document.fonts?.ready.then(remeasure, () => {});
    wake();

    return () => {
      if (raf > 0) cancelAnimationFrame(raf);
      window.clearTimeout(watchdog);
      raf = -1; // Stops any pending wake after unmount.
      refreshRef.current = () => {};
      heroEl.removeEventListener("pointermove", onMove);
      heroEl.removeEventListener("pointerleave", onLeave);
      reduced.removeEventListener("change", wake);
      narrow.removeEventListener("change", wake);
      fine.removeEventListener("change", wake);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("themechange", refresh);
      intersection.disconnect();
      resizer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-fairy"
      aria-hidden="true"
      data-fairy-kind={kind}
      data-fairy-state="resting"
    />
  );
}
