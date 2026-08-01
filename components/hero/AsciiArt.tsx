"use client";

import { useEffect, useRef } from "react";
import portrait from "@/public/ascii/portrait.json";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const DATA = portrait as {
  cols: number;
  rows: number;
  ramp: string;
  chars: string;
  b: number[];
};

const N = DATA.cols * DATA.rows;
const RAMP = DATA.ramp;

const CONFIG = {
  R_FACTOR: 0.14, // void radius as a fraction of the smaller dimension (~40px)
  RIM_FACTOR: 1.1, // rim ring sits just outside the void radius
  RIM_VAR: 0.12, // per-cell rim variation for an organic ring
  MAXDISP_FACTOR: 1.2, // offset cap as a fraction of the void radius
  K_LERP: 0.02, // ease toward the rim target (per ms, ~0.33/frame at 60fps)
  BUILD_MS: 1400, // entrance duration: cells gust-assemble in over ~1.4s
  STAGGER: 0.55, // wave spread along the wind axis (0 = all at once)
  WIND_AMP: 0.55, // flight distance as a fraction of the smaller dimension
  SWIRL: 0.45, // perpendicular arc amplitude for the gust-like curved paths
  SPIN: 0.9, // per-glyph rotation (rad) that winds down as the cell settles
};

// Diagonal down-right gust; cells arrive from up-wind (up-left, off-canvas).
const WIND = { x: Math.SQRT1_2, y: Math.SQRT1_2 };
const PERP = { x: -WIND.y, y: WIND.x };

/**
 * The interactive ASCII portrait. Renders the precomputed glyph grid on a
 * canvas; on hover every cell inside the void radius is pushed purely
 * radially out to a rim ring, so the disk around the cursor becomes
 * completely empty. Cells move straight away from the cursor (in all
 * directions) and hold at the rim, then ease back to re-form the portrait
 * when the cursor leaves. A pure positional interpolation — no velocity, no
 * overshoot, no orbital/swirl motion.
 *
 * Pointer behavior is tiered:
 *  - fine pointer + no reduced-motion: continuous rAF loop easing cells
 *    toward their radial rim targets;
 *  - fine pointer + reduced-motion: same repel, snapped once per pointer
 *    event (no continuous animation);
 *  - coarse pointer (touch/phone): static single draw.
 *
 * On load the portrait is constructed by a "gust of wind": cells activate as
 * a diagonal sweep passes and fly in from up-wind along curved, spinning
 * paths, settling into the grid before interactive behavior begins.
 *
 * The accent color is read from the `--accent` CSS variable and the canvas is
 * redrawn whenever the theme changes, so the portrait follows the theme
 * switcher in every mode.
 */
export function AsciiArt({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;

    // Precomputed base positions (CSS px) + per-cell brightness index.
    const baseX = new Float32Array(N);
    const baseY = new Float32Array(N);
    const idx = new Uint8Array(N);

    // Normalized progress (0-1) along the wind axis, so the gust sweeps the
    // grid diagonally instead of every cell arriving at once.
    const buildIdx = new Float32Array(N);

    // Cell state: offset from base and motion glow (0-1).
    const curX = new Float32Array(N);
    const curY = new Float32Array(N);
    const curBoost = new Float32Array(N);

    // Deterministic per-cell variation so cells don't all land on the exact
    // same rim radius.
    const seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = Math.sin(i * 12.9898) * 43758.5453;
      seed[i] = 0.7 + 0.6 * (r - Math.floor(r));
    }

    const mouse = { x: -1000, y: -1000, inside: false };
    let accent = "#7ec699";

    // Entrance build: revealT goes 0 -> 1 while the gust constructs the
    // portrait; revealDone switches draw() to the interactive path.
    let revealT = 0;
    let revealDone = false;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));

      const cellW = W / DATA.cols;
      const cellH = H / DATA.rows;
      for (let i = 0; i < N; i++) {
        const col = i % DATA.cols;
        const row = (i / DATA.cols) | 0;
        baseX[i] = (col + 0.5) * cellW;
        baseY[i] = (row + 0.5) * cellH;
        idx[i] = Math.min(
          RAMP.length - 1,
          Math.round((DATA.b[i] / 255) * (RAMP.length - 1))
        );
      }

      let dmin = Infinity;
      let dmax = -Infinity;
      for (let i = 0; i < N; i++) {
        const d = baseX[i] * WIND.x + baseY[i] * WIND.y;
        if (d < dmin) dmin = d;
        if (d > dmax) dmax = d;
      }
      const span = dmax - dmin || 1;
      for (let i = 0; i < N; i++) {
        buildIdx[i] = (baseX[i] * WIND.x + baseY[i] * WIND.y - dmin) / span;
      }
    };

    const readAccent = () => {
      accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim() || "#7ec699";
    };
    readAccent();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const draw = () => {
      if (W < 1 || H < 1) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = accent;
      const fontSize = (H / DATA.rows) * 1.2;
      ctx.font = `${fontSize.toFixed(1)}px "JetBrains Mono", monospace`;
      const amp = Math.min(W, H) * CONFIG.WIND_AMP;
      const stagger = CONFIG.STAGGER;

      for (let i = 0; i < N; i++) {
        const bright = DATA.b[i] / 255;
        let alpha = 0.1 + 0.9 * bright;
        let char = RAMP[idx[i]];

        // Entrance: each cell activates when the wind sweep reaches it, then
        // flies in from up-wind along a curved, swirling path while spinning
        // down to zero rotation as it settles into its slot.
        if (!revealDone) {
          const t = Math.max(
            0,
            Math.min(1, revealT * (1 + stagger) - buildIdx[i] * stagger)
          );
          if (t < 1) {
            const s = easeOutCubic(t);
            const d = (1 - s) * amp;
            const swirl = d * CONFIG.SWIRL * Math.sin(s * Math.PI * 3);
            const x = baseX[i] - WIND.x * d + PERP.x * swirl;
            const y = baseY[i] - WIND.y * d + PERP.y * swirl;
            ctx.globalAlpha = Math.max(0, alpha * Math.min(1, t * 3));
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(CONFIG.SPIN * (1 - s));
            ctx.fillText(char, 0, 0);
            ctx.restore();
            continue;
          }
        }

        if (mouse.inside) {
          const b = curBoost[i];
          alpha = Math.min(1, alpha * (0.8 + 0.35 * b));
          if (b > 0.15) char = RAMP[Math.min(RAMP.length - 1, idx[i] + 2)];
        }
        ctx.globalAlpha = Math.max(0.03, alpha);
        ctx.fillText(char, baseX[i] + curX[i], baseY[i] + curY[i]);
      }
      ctx.globalAlpha = 1;
    };

    // Radial push-to-rim for a cell at distance `dist` from the cursor: every
    // cell inside its rim is moved all the way out to the rim (no falloff),
    // so the disk around the cursor empties completely. Returns the target
    // offset magnitude, 0 for cells already beyond the rim.
    const repel = (dist: number, R: number, maxDisp: number, s: number) => {
      const rim = R * (CONFIG.RIM_FACTOR + CONFIG.RIM_VAR * (s - 0.85));
      if (dist >= rim || dist < 0.001) return 0;
      return Math.min(rim - dist, maxDisp);
    };

    // Discrete mode (reduced motion): snap cells to their radial rim targets
    // once per pointer event — instant, clearly visible clearing.
    const snap = () => {
      const R = Math.min(W, H) * CONFIG.R_FACTOR;
      const maxDisp = R * CONFIG.MAXDISP_FACTOR;
      const { x: mx, y: my, inside } = mouse;
      for (let i = 0; i < N; i++) {
        const dx = mx - baseX[i];
        const dy = my - baseY[i];
        const dist = Math.hypot(dx, dy);
        const f = inside ? repel(dist, R, maxDisp, seed[i]) : 0;
        curX[i] = dist > 0.001 && f > 0 ? (dx / dist) * f : 0;
        curY[i] = dist > 0.001 && f > 0 ? (dy / dist) * f : 0;
        curBoost[i] = f > 0 ? Math.max(0, 1 - dist / R) : 0;
      }
    };

    // Continuous mode: pure positional interpolation. Every cell eases toward
    // its radial rim target — the target is always the straight-outward
    // projection, so cells move purely radially with no overshoot or
    // tangential motion. Glow reflects per-frame travel (visual only).
    const interpolate = (k: number) => {
      const R = Math.min(W, H) * CONFIG.R_FACTOR;
      const maxDisp = R * CONFIG.MAXDISP_FACTOR;
      const { x: mx, y: my, inside } = mouse;

      for (let i = 0; i < N; i++) {
        const px = baseX[i] + curX[i];
        const py = baseY[i] + curY[i];
        const dx = mx - px;
        const dy = my - py;
        const dist = Math.hypot(dx, dy);
        const f = inside ? repel(dist, R, maxDisp, seed[i]) : 0;
        const tx = dist > 0.001 && f > 0 ? (dx / dist) * f : 0;
        const ty = dist > 0.001 && f > 0 ? (dy / dist) * f : 0;

        const ox = curX[i];
        const oy = curY[i];
        curX[i] += (tx - curX[i]) * k;
        curY[i] += (ty - curY[i]) * k;

        const travel = Math.hypot(curX[i] - ox, curY[i] - oy);
        const prox = f > 0 ? Math.max(0, 1 - dist / R) : 0;
        curBoost[i] = Math.max(prox, Math.min(1, travel * 0.6));
      }
    };

    const fine = window.matchMedia("(pointer: fine)").matches;
    const continuous = fine && !reduced;
    const discrete = fine && reduced;

    resize();
    draw();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => draw());
    }

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.inside = true;
      if (discrete) {
        snap();
        draw();
      }
    };
    const onEnter = () => {
      mouse.inside = true;
    };
    const onLeave = () => {
      mouse.inside = false;
      mouse.x = -1000;
      mouse.y = -1000;
      if (discrete) {
        snap();
        draw();
      }
    };

    let raf = 0;

    const beginInteractive = () => {
      if (continuous) {
        let last = performance.now();
        const step = (now: number) => {
          const delta = Math.min(50, now - last);
          last = now;
          interpolate(Math.min(1, delta * CONFIG.K_LERP));
          draw();
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }
      if (fine) {
        wrap.addEventListener("pointermove", onMove, { passive: true });
        wrap.addEventListener("pointerenter", onEnter);
        wrap.addEventListener("pointerleave", onLeave);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(wrap);

    // Entrance build: gust-assemble the portrait, then hand off to the
    // interactive tier (hover repel / discrete snap / static).
    const buildStart = performance.now();
    const build = (now: number) => {
      revealT = Math.min(1, (now - buildStart) / CONFIG.BUILD_MS);
      draw();
      if (revealT >= 1) {
        revealDone = true;
        draw();
        beginInteractive();
      } else {
        raf = requestAnimationFrame(build);
      }
    };
    raf = requestAnimationFrame(build);

    // Re-render whenever the theme accent changes (data-theme on <html>).
    const mo = new MutationObserver(() => {
      readAccent();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      if (fine) {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerenter", onEnter);
        wrap.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="ASCII portrait of Manushwi"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
