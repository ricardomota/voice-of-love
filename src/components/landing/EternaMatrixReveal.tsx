import React, { useEffect, useRef, useState } from "react";

/**
 * EternaMatrixReveal
 * A lightweight canvas animation that renders a soft matrix of characters
 * and subtly reveals a centered word (default: "eterna").
 *
 * Tailwind ready. Drop this into any page and it will scale to its parent.
 */
export default function EternaMatrixReveal({
  word = "eterna",
  rows = 10,
  cols = 28,
  fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
  baseFontSize = 22, // in px at 1024px wide; auto-scales with width
  tickMs = 200, // frame interval for character churn - reduced frequency
  revealDelayMs = 1200, // when to start revealing the word
  revealStepMs = 200, // per-letter settle cadence - slower for smoother effect
  noiseOpacity = 0.06,
  bgGradient = "from-[#fff2ff] via-[#f3f3ff] to-[#eef5ff]",
}: {
  word?: string;
  rows?: number;
  cols?: number;
  fontFamily?: string;
  baseFontSize?: number;
  tickMs?: number;
  revealDelayMs?: number;
  revealStepMs?: number;
  noiseOpacity?: number;
  bgGradient?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  // Character set: subtle, legible
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

  // Respect reduced motion
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    // Size to parent
    const resize = () => {
      const parent = canvas.parentElement!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // Layout grid
    const state = {
      t0: performance.now(),
      cells: [] as { ch: string; settle: boolean; alpha: number }[],
    };
    const total = rows * cols;
    for (let i = 0; i < total; i++) state.cells.push({ ch: randChar(), settle: false, alpha: 0.6 + Math.random() * 0.3 });

    function randChar() {
      return charset[(Math.random() * charset.length) | 0];
    }

    const draw = (now: number) => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const colGap = 18; // px spacing between columns
      const rowGap = 28; // px spacing between rows

      // Auto font scale with width
      const scale = Math.max(0.8, Math.min(1.4, width / 1024));
      const fontSize = Math.round(baseFontSize * scale);
      ctx.clearRect(0, 0, width, height);

      // Black background fill per request
      ctx.globalAlpha = 1;
      ctx.fillStyle = "hsl(0 0% 0%)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Compute grid cell size from font metrics
      const cellW = colGap + fontSize * 0.8;
      const cellH = rowGap;

      // Center grid in canvas
      const gridW = cols * cellW;
      const gridH = rows * cellH;
      const startX = (width - gridW) / 2 + cellW / 2;
      const startY = (height - gridH) / 2 + cellH / 2;

      // Word placement (center row, centered horizontally)
      const rowIndex = Math.floor(rows / 2);
      const wordColStart = Math.floor((cols - word.length) / 2);

      // Timings
      const t = now - state.t0;
      const tick = now - lastTickRef.current > tickMs;

      // Reveal schedule – stagger each letter
      const revealStart = revealDelayMs;
      const settledCount = Math.max(0, Math.min(word.length, Math.floor((t - revealStart) / revealStepMs)));

      // Draw background characters
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * cellW;
          const y = startY + r * cellH;
          const cell = state.cells[i++];

          // Decide if this cell belongs to the word
          const inWord = r === rowIndex && c >= wordColStart && c < wordColStart + word.length;
          const letterIdx = c - wordColStart;

      // Update churn - reduced frequency for performance
      if (tick && !inWord && !prefersReducedMotion) {
        if (Math.random() < 0.15) cell.ch = randChar(); // Reduced from 0.25 to 0.15
      }

          ctx.globalAlpha = inWord ? 1 : 0.15;
          ctx.fillStyle = "hsl(0 0% 100%)";

          // Word reveal behavior
          if (inWord) {
            const target = word[letterIdx];
            const shouldSettle = letterIdx < settledCount || prefersReducedMotion;
            if (shouldSettle) {
              cell.ch = target;
              cell.settle = true;
            } else if (!cell.settle && !prefersReducedMotion) {
              // Pre-reveal scramble for this slot
              if (tick) cell.ch = randChar();
            }
          }

          ctx.fillText(cell.ch, x, y);
        }
      }

      // Light film grain
      if (noiseOpacity > 0) {
        const noise = 40;
        ctx.globalAlpha = noiseOpacity;
        for (let n = 0; n < noise; n++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const s = 0.5 + Math.random() * 1.5;
          ctx.fillStyle = "#000";
          ctx.fillRect(x, y, s, s);
        }
        ctx.globalAlpha = 1;
      }

      if (tick) lastTickRef.current = now;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [mounted, rows, cols, baseFontSize, tickMs, revealDelayMs, revealStepMs, noiseOpacity, word, fontFamily]);

  return (
    <div className={`relative w-full h-[60vh] overflow-hidden rounded-2xl shadow-sm bg-gradient-to-b ${bgGradient}`}>
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(100%_120%_at_50%_0%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_60%),radial-gradient(120%_100%_at_50%_100%,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_60%)]" />
      <canvas ref={canvasRef} className="absolute inset-0" aria-label={`Animated letter matrix revealing the word ${word}`} />
      {/* Subtle center divider like your reference (optional). Remove if undesired. */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-slate-900/5" />
    </div>
  );
}

/**
 * Usage example
 *
 * <section className="px-6 py-16">
 *   <div className="mx-auto max-w-6xl">
 *     <EternaMatrixReveal word="eterna" />
 *   </div>
 * </section>
 */
