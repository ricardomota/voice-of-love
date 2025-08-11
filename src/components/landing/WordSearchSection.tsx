import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Word Search style animated section that occasionally reveals the word "ETERNA"
// Built lightweight with Tailwind utilities and small timed updates

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const WORD = 'ETERNA';

const ROWS = 8;
const COLS = 16;
const TICK_MS = 750; // animation tick
const RANDOM_FLIPS_PER_TICK = 6; // how many random cells morph each tick

// Helper to make a key for a cell
const keyOf = (r: number, c: number) => `${r}-${c}`;

// Predefined paths where the word appears (arrays of [row, col])
const PATHS: Array<Array<[number, number]>> = [
  // Horizontal middle
  Array.from({ length: WORD.length }, (_, i) => [Math.floor(ROWS / 2), 4 + i]) as Array<[number, number]>,
  // Diagonal down-right from upper left quadrant
  Array.from({ length: WORD.length }, (_, i) => [1 + i, 2 + i]) as Array<[number, number]>,
  // Horizontal near bottom
  Array.from({ length: WORD.length }, (_, i) => [ROWS - 2, 3 + i]) as Array<[number, number]>,
  // Diagonal up-right from lower left quadrant
  Array.from({ length: WORD.length }, (_, i) => [ROWS - 2 - i, 1 + i]) as Array<[number, number]>,
];

function randomLetter() {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

function createGrid(): string[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => randomLetter()));
}

const WordSearchSection: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(() => createGrid());
  const [pathIndex, setPathIndex] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const revealedSetRef = useRef<Set<string>>(new Set());

  // Current path where the word will animate
  const path = useMemo(() => PATHS[pathIndex % PATHS.length], [pathIndex]);

  // Reset when path changes
  useEffect(() => {
    revealedSetRef.current = new Set();
    setRevealStep(0);
    setGrid(createGrid());
  }, [pathIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((prev) => {
        const next = prev.map((row) => row.slice());

        // Random small flips outside revealed path for subtle movement
        let flips = 0;
        while (flips < RANDOM_FLIPS_PER_TICK) {
          const r = Math.floor(Math.random() * ROWS);
          const c = Math.floor(Math.random() * COLS);
          const k = keyOf(r, c);
          if (!revealedSetRef.current.has(k)) {
            next[r][c] = randomLetter();
            flips++;
          } else {
            // revealed letters can softly pulse by re-assigning same letter (no-op visually)
          }
        }

        // Reveal next letter along the path
        if (revealStep < path.length) {
          const [rr, cc] = path[revealStep];
          next[rr][cc] = WORD[revealStep];
          revealedSetRef.current.add(keyOf(rr, cc));
        }
        return next;
      });

      // Move reveal forward or switch path
      setRevealStep((s) => {
        if (s + 1 <= path.length + 3) {
          return s + 1;
        }
        // After a short pause past full reveal, move to next path
        setPathIndex((p) => (p + 1) % PATHS.length);
        return 0;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [path]);

  return (
    <section aria-labelledby="word-search-title" className="relative py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* soft gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-accent/5" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 sm:mb-12">
          <h2 id="word-search-title" className="text-2xl sm:text-3xl font-semibold text-foreground">
            Veja a ETERNA aparecer
          </h2>
          <p className="text-muted-foreground mt-2">Uma matriz dinâmica de letras onde a palavra aparece sutilmente.</p>
        </header>

        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 sm:p-6">
          {/* Responsive letter grid */}
          <div
            className="grid gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-4 font-mono select-none"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((ch, c) => {
                const k = keyOf(r, c);
                const isRevealed = revealedSetRef.current.has(k);
                const isWordChar = isRevealed && path.some(([pr, pc], idx) => pr === r && pc === c && WORD[idx] === ch);

                return (
                  <span
                    key={k}
                    className={cn(
                      'flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded transition-colors duration-300 animate-fade-in',
                      isWordChar
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground/70'
                    )}
                    aria-hidden
                  >
                    {ch}
                  </span>
                );
              })
            )}
          </div>
        </div>
        <p className="sr-only">Grade de letras animada onde a palavra ETERNA aparece periodicamente.</p>
      </div>

      {/* subtle decorative blur */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-[60%] bg-primary/10 blur-3xl rounded-full" />
    </section>
  );
};

export default WordSearchSection;
