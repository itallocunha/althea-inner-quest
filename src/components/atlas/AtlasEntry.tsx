import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ATLAS_ART } from '@/lib/journeyAssets';

export interface AtlasDeparture {
  x: number;
  y: number;
  diameter: number;
  name: string;
}

export function AtlasEntry({ origin, reducedMotion, onComplete }: { origin: AtlasDeparture; reducedMotion: boolean; onComplete: () => void }) {
  useEffect(() => {
    if (reducedMotion) { onComplete(); return; }
    // A backgrounded tab must not leave the player waiting for an animation callback.
    const fallback = window.setTimeout(onComplete, 1500);
    return () => window.clearTimeout(fallback);
  }, [onComplete, reducedMotion]);

  return (
    <div className="atlas-entry" role="status" aria-label={'Entrando no ' + origin.name}>
      <motion.div className="atlas-entry-shade" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }} />
      <div className="atlas-entry-flight" aria-hidden="true" style={{ left: origin.x, top: origin.y, width: origin.diameter, height: origin.diameter }}>
        <motion.div
          className="atlas-entry-world"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{ x: window.innerWidth / 2 - origin.x, y: window.innerHeight / 2 - origin.y, scale: Math.max(window.innerWidth, window.innerHeight) * 2.8 / origin.diameter }}
          transition={{ duration: 1.05, ease: [.62, .05, .24, 1] }}
          onAnimationComplete={onComplete}
        >
          <span className="atlas-planet-sphere"><span className="atlas-planet-surface" style={{ backgroundImage: 'url(' + ATLAS_ART.fiveOrbsSurface + ')' }} /></span>
        </motion.div>
      </div>
      <motion.div className="atlas-entry-caption" initial={{ opacity: 0, y: 10 }} animate={{ opacity: [0, 1, 1, 0], y: 0 }} transition={{ duration: 1.05 }}>
        <span>Uma nova travessia começa</span><strong>{origin.name}</strong><span>Entrando no mundo…</span>
      </motion.div>
    </div>
  );
}
