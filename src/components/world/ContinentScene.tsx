import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getChallengesForOrb } from '@/data/gameData';
import type { OrbData } from '@/types/game';
import { RpgIcon } from '@/components/rpg/RpgIcon';
import { CHARACTER_ART, ORB_ART, ORB_CONTINENT_ART, getChallengeArt } from '@/lib/journeyAssets';

interface ContinentSceneProps {
  orb: OrbData;
  orbIndex: number;
  /** Screen point the portal opens from (the orb that was tapped). */
  origin: { x: number; y: number };
  onClose: () => void;
}

// Ten stops winding up the continent, in percentages of the screen (bottom-left to top)
const TRAIL: [number, number][] = [
  [22, 80], [56, 74], [79, 65], [52, 57], [24, 49], [48, 41], [76, 34], [52, 27], [27, 21], [55, 15],
];

/** Catmull-Rom spline through the stops, as an SVG path in the same 0-100 space. */
function smoothPath(points: [number, number][]) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function ContinentScene({ orb, orbIndex, origin, onClose }: ContinentSceneProps) {
  const navigate = useNavigate();
  const { isChallengeUnlocked, isChallengeCompleted, getOrbProgress, isOrbUnlocked } = useGame();
  const [picked, setPicked] = useState<string | null>(null);

  const color = `hsl(var(--orb-${orb.id}))`;
  const challenges = getChallengesForOrb(orb.id);
  const progress = getOrbProgress(orbIndex);
  const unlockedOrb = isOrbUnlocked(orbIndex);
  const path = useMemo(() => smoothPath(TRAIL), []);
  const completedCount = challenges.filter(c => isChallengeCompleted(c.id)).length;
  const currentIndex = challenges.findIndex(c => !isChallengeCompleted(c.id) && isChallengeUnlocked(c.id));
  const pickedChallenge = challenges.find(c => c.id === picked) ?? null;
  const ringLen = 2 * Math.PI * 22;

  const iris = (r: string) => `circle(${r} at ${origin.x}px ${origin.y}px)`;

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-background"
      initial={{ clipPath: iris('0px') }}
      animate={{ clipPath: iris('150vmax') }}
      exit={{ clipPath: iris('0px') }}
      transition={{ duration: 0.85, ease: [0.65, 0, 0.2, 1] }}
    >
      {/* Terrain with a slow Ken Burns drift */}
      <motion.img
        src={ORB_CONTINENT_ART[orb.id]}
        alt={`Território da ${orb.name}`}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.25 }}
        animate={{ scale: [1.08, 1.16, 1.08], x: ['0%', '-2.5%', '0%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent,hsl(var(--background)/0.85))]" />
      <div className="absolute inset-0 opacity-30 mix-blend-color" style={{ background: `linear-gradient(180deg, ${color}, transparent 60%)` }} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background/95 to-transparent" />

      {/* Drifting motes in the orb's colour */}
      {Array.from({ length: 16 }, (_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{ left: `${(i * 37) % 100}%`, bottom: '-2%', width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2, background: color, boxShadow: `0 0 12px ${color}` }}
          animate={{ y: [0, -window.innerHeight * 1.05], x: [0, ((i % 5) - 2) * 26], opacity: [0, 0.9, 0] }}
          transition={{ duration: 9 + (i % 6) * 2, repeat: Infinity, delay: (i * 0.7) % 8, ease: 'linear' }}
        />
      ))}

      {/* The trail */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={path} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="5" strokeLinecap="round" strokeDasharray="0.1 9" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.max(0.02, completedCount / (challenges.length - 1)) }}
          transition={{ duration: 1.6, delay: 0.9, ease: 'easeOut' }}
        />
        <path className="world-flow" d={path} fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 22" vectorEffect="non-scaling-stroke" style={{ animation: 'dash-flow 1.4s linear infinite' }} />
      </svg>

      {/* Challenge stops */}
      {challenges.map((challenge, i) => {
        const [x, y] = TRAIL[i];
        const done = isChallengeCompleted(challenge.id);
        const open = isChallengeUnlocked(challenge.id);
        const current = i === currentIndex;
        return (
          <div key={challenge.id} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
            <div className="-translate-x-1/2 -translate-y-1/2">
              <motion.button
                aria-label={`Desafio ${i + 1}: ${challenge.title}`}
                onClick={() => setPicked(challenge.id === picked ? null : challenge.id)}
                className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 font-display text-sm font-bold"
                style={{
                  borderColor: done || open ? color : 'rgba(255,255,255,0.25)',
                  background: done ? color : 'radial-gradient(circle at 35% 25%, hsl(272 50% 30%), hsl(266 50% 10%))',
                  color: done ? 'hsl(266 50% 8%)' : open ? color : 'hsl(262 20% 65%)',
                  boxShadow: done || open ? `0 0 18px ${color}, inset 0 1px 0 rgba(255,255,255,0.4)` : 'inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: picked === challenge.id ? 1.25 : 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.7 + i * 0.09 }}
                whileTap={{ scale: 0.9 }}
              >
                {current && (
                  <span className="world-halo absolute -inset-2 rounded-full border-2 border-dashed" style={{ borderColor: color, animation: 'halo-spin 6s linear infinite' }} />
                )}
                {current && <span className="world-breathe absolute -inset-1 rounded-full" style={{ boxShadow: `0 0 0 3px ${color}`, animation: 'orb-breathe 1.8s ease-in-out infinite' }} />}
                {done ? <Check size={20} strokeWidth={3} /> : open ? i + 1 : <RpgIcon name="lock" size={17} />}
              </motion.button>

              {current && unlockedOrb && (
                <motion.img
                  src={CHARACTER_ART.mage}
                  alt="Você está aqui"
                  className="pointer-events-none absolute -top-[4.5rem] left-1/2 h-20 w-14 -translate-x-1/2 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)]"
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start gap-3 px-4" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
        <motion.button
          onClick={onClose}
          className="flex h-11 shrink-0 items-center gap-1 rounded-full border border-[hsl(var(--gold-deep))] bg-black/55 pl-2 pr-4 font-display text-[11px] font-bold uppercase tracking-wider text-foreground backdrop-blur"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ChevronLeft size={18} /> Mundo
        </motion.button>
        <motion.div className="min-w-0 flex-1 text-right" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <h2 className="font-title text-lg font-bold leading-tight" style={{ color, textShadow: `0 0 18px ${color}` }}>{orb.name}</h2>
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-foreground/80">{orb.theme}</p>
        </motion.div>
      </div>

      {/* Bottom panel */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
        <AnimatePresence mode="wait">
          {pickedChallenge ? (
            <motion.div
              key={pickedChallenge.id}
              className="rpg-frame mx-auto flex max-w-md gap-3 overflow-hidden rounded-2xl p-3"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <img src={getChallengeArt(pickedChallenge.id)} alt="" className="h-20 w-32 shrink-0 rounded-lg object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="truncate font-display text-xs font-bold uppercase tracking-wider text-foreground">{pickedChallenge.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">+{pickedChallenge.xpReward} XP · {pickedChallenge.medalName}</p>
                </div>
                <button
                  disabled={!isChallengeUnlocked(pickedChallenge.id)}
                  onClick={() => navigate(`/challenge/${pickedChallenge.id}`)}
                  className="gradient-accent flex items-center justify-center gap-1 rounded-full px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-accent-foreground disabled:opacity-40"
                >
                  {isChallengeCompleted(pickedChallenge.id) ? 'Rever' : isChallengeUnlocked(pickedChallenge.id) ? 'Abrir desafio' : 'Bloqueado'} <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              className="rpg-frame mx-auto flex max-w-md items-center gap-3 rounded-2xl p-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.9 }}
            >
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 52 52" className="absolute inset-0 -rotate-90">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                  <motion.circle cx="26" cy="26" r="22" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={ringLen} initial={{ strokeDashoffset: ringLen }} animate={{ strokeDashoffset: ringLen * (1 - progress / 100) }} transition={{ duration: 1.4, delay: 1 }} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
                </svg>
                <img src={ORB_ART[orb.id]} alt="" className="absolute inset-2 h-12 w-12 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>{completedCount}/{challenges.length} desafios · {progress}%</p>
                <p className="line-clamp-2 font-body text-sm text-foreground/85">{orb.focus}. Toque em um marco da trilha para ver o desafio.</p>
              </div>
              <button
                onClick={() => navigate(`/orb/${orb.id}`)}
                className="gradient-accent shrink-0 rounded-full px-4 py-2 font-display text-[11px] font-bold uppercase tracking-wider text-accent-foreground"
              >
                Trilha
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
