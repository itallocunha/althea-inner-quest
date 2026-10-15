import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { ORB_ART } from '@/lib/journeyAssets';
import type { OrbId } from '@/types/game';

const ORBS: OrbId[] = ['blue', 'green', 'purple', 'red', 'yellow'];

export interface OrbBurst {
  id: number;
  x: number;
  y: number;
}

export function ProjectionAtmosphere({ animated }: { animated: boolean }) {
  return <div className="projection-atmosphere" aria-hidden="true">
    <div className="projection-aurora projection-aurora-one" />
    <div className="projection-aurora projection-aurora-two" />
    <div className="projection-light-rays" />
    <div className="projection-magic-circle">
      <svg viewBox="0 0 600 600" fill="none">
        <circle cx="300" cy="300" r="283" stroke="currentColor" strokeOpacity=".25" />
        <circle cx="300" cy="300" r="266" stroke="currentColor" strokeOpacity=".4" strokeDasharray="2 22" />
        <circle cx="300" cy="300" r="239" stroke="currentColor" strokeOpacity=".2" />
        <path d="m300 40 225 390H75zM300 560 75 170h450z" stroke="currentColor" strokeOpacity=".12" />
        {ORBS.map((orb, index) => {
          const angle = (index * 72 - 90) * Math.PI / 180;
          return <circle key={orb} cx={300 + Math.cos(angle) * 283} cy={300 + Math.sin(angle) * 283} r="6" fill="currentColor" fillOpacity=".5" />;
        })}
      </svg>
    </div>
    <div className="projection-pedestal" />
    {animated && Array.from({ length: 12 }, (_, index) => {
      const orb = ORBS[index % ORBS.length];
      return <motion.img key={index} src={ORB_ART[orb]} alt="" className="projection-floating-orb"
        style={{ left: `${8 + (index * 37) % 84}%`, top: `${10 + (index * 23) % 78}%`, width: 15 + index % 3 * 6 }}
        animate={{ y: [20, -35, 20], x: [0, index % 2 ? 18 : -18, 0], opacity: [.12, .38, .12], rotate: [0, 35, 0] }}
        transition={{ duration: 7 + index % 4, delay: -index * .6, repeat: Infinity, ease: 'easeInOut' }} />;
    })}
  </div>;
}

export function OrbBurstEffects({ bursts, onComplete, animated }: { bursts: OrbBurst[]; onComplete: (id: number) => void; animated: boolean }) {
  const reduced = !animated;
  return <div className="projection-bursts" aria-hidden="true">
    {bursts.map(burst => <div key={burst.id} className="projection-burst" data-testid="orb-burst" style={{ left: burst.x, top: burst.y }}>
      <motion.span className="projection-shockwave"
        initial={{ scale: .25, opacity: .8 }} animate={{ scale: reduced ? 1 : 3.5, opacity: 0 }}
        transition={{ duration: reduced ? .6 : .65 }} />
      {Array.from({ length: reduced ? 5 : 15 }, (_, index) => {
        const orb = ORBS[index % ORBS.length];
        const angle = ((index / (reduced ? 5 : 15)) * 360 + (burst.id % 6) * 15) * Math.PI / 180;
        const distance = reduced ? 30 : 100 + (index % 4) * 40;
        return <motion.img key={index} src={ORB_ART[orb]} alt="" className="projection-orb-particle"
          style={{ width: 14 + index % 3 * 7, '--particle-color': `var(--orb-${orb})` } as CSSProperties}
          initial={{ x: 0, y: 0, scale: .3, opacity: 1, rotate: 0 }}
          animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - (reduced ? 0 : 50), scale: reduced ? .6 : [.3, 1.1, .1], opacity: [1, 1, 0], rotate: reduced ? 0 : (index % 2 ? 160 : -160) }}
          transition={{ duration: reduced ? .7 : 1.25 + index % 3 * .15, ease: 'easeOut' }}
          onAnimationComplete={index === 2 ? () => onComplete(burst.id) : undefined} />;
      })}
    </div>)}
  </div>;
}
