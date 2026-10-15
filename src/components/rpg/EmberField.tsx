import { useMemo } from 'react';
import type { CSSProperties } from 'react';

const COLORS = ['#ffd766', '#ffb347', '#c89bff', '#ffe9a8'];

/** Slow drifting embers behind every screen. Purely decorative and hidden for reduced-motion users. */
export function EmberField({ count = 18 }: { count?: number }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic spread so the field looks the same on every mount
        const r = (n: number) => Math.abs(Math.sin((i + 1) * n)) % 1;
        const size = 2 + r(12.9) * 3;
        return {
          key: i,
          style: {
            left: `${r(78.2) * 100}%`,
            bottom: '-12px',
            width: size,
            height: size,
            background: COLORS[i % COLORS.length],
            boxShadow: `0 0 ${size * 3}px ${COLORS[i % COLORS.length]}`,
            '--dur': `${11 + r(4.1) * 12}s`,
            '--delay': `${-r(9.7) * 20}s`,
            '--sway': `${(r(2.3) - 0.5) * 90}px`,
          } as CSSProperties,
        };
      }),
    [count],
  );

  return (
    <div className="ember-field pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {embers.map(ember => (
        <span key={ember.key} className="absolute rounded-full opacity-0 animate-ember-rise" style={ember.style} />
      ))}
    </div>
  );
}
