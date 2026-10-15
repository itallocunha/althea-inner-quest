import type { CSSProperties } from 'react';

// Stable, deliberately uneven positions keep stars from lining up in a visible grid.
const fraction = (seed: number) => { const value = Math.sin(seed * 127.1) * 43758.5453; return value - Math.floor(value); };
const layers = [72, 52, 32].map((count, layer) => Array.from({ length: count }, (_, i) => {
  const seed = i + layer * 101 + 1;
  return {
    left: (fraction(seed) * 112 - 6) + '%',
    top: (fraction(seed + 71) * 112 - 6) + '%',
    '--star-size': (layer === 2 ? 2 + fraction(seed + 3) * 1.6 : .8 + layer * .6 + fraction(seed + 3)) + 'px',
    '--star-delay': -(fraction(seed + 5) * 60) + 's',
    '--star-twinkle': (3 + fraction(seed + 9) * 5) + 's',
    '--star-speed': (layer === 2 ? 17 + fraction(seed + 12) * 13 : 38 + fraction(seed + 12) * 36) + 's',
    '--star-dx': ((layer + 1) * (fraction(seed + 15) > .5 ? -23 : 19)) + 'px',
    '--star-dy': (30 + layer * 30) + 'px',
  } as CSSProperties;
}));

export function AtlasBackdrop() {
  return (
    <div className="atlas-cosmos" aria-hidden="true">
      <div className="atlas-nebula atlas-nebula--violet" />
      <div className="atlas-nebula atlas-nebula--teal" />
      <div className="atlas-galaxy"><div className="atlas-galaxy-arms" /><div className="atlas-galaxy-core" /></div>
      {layers.map((stars, layer) => (
        <div className={'atlas-stars atlas-stars--' + layer} key={layer}>
          {stars.map((style, i) => <span key={i} className={i % 11 === 0 ? 'atlas-star-radiant' : undefined} style={style} />)}
        </div>
      ))}
      <div className="atlas-meteors"><i /><i /><i /></div>
    </div>
  );
}
