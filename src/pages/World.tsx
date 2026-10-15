import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { BottomNav } from '@/components/BottomNav';
import { ContinentScene } from '@/components/world/ContinentScene';
import { RpgIcon } from '@/components/rpg/RpgIcon';
import { OrnateDivider } from '@/components/rpg/Ornaments';
import { CHARACTER_ART, ORB_ART, WORLD_MAP_ART } from '@/lib/journeyAssets';

const MAP_ASPECT = 1400 / 876;
const ZOOM = 2.4;

/** Where each orb floats on the world map, as fractions of the map image (same order as ORBS). */
const ORB_SPOTS: [number, number][] = [
  [0.31, 0.27], // blue: the frozen highlands
  [0.76, 0.26], // green: the forest
  [0.51, 0.44], // purple: the crystal heart
  [0.22, 0.69], // red: the volcano
  [0.73, 0.72], // yellow: the desert
];

const CLOUDS = [
  { top: 8, size: 220, dur: 70, delay: -12, o: 0.5 },
  { top: 30, size: 300, dur: 95, delay: -50, o: 0.4 },
  { top: 52, size: 240, dur: 80, delay: -30, o: 0.45 },
  { top: 74, size: 320, dur: 110, delay: -75, o: 0.35 },
  { top: 90, size: 200, dur: 65, delay: -5, o: 0.5 },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function World() {
  const reducedMotion = useReducedMotion();
  const { state, isOrbUnlocked, getOrbProgress } = useGame();
  const [view, setView] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [selected, setSelected] = useState<number | null>(null);
  const [sceneOpen, setSceneOpen] = useState(false);
  const [wobble, setWobble] = useState<number | null>(null);
  const [hint, setHint] = useState(true);

  const camX = useMotionValue(0);
  const camY = useMotionValue(0);
  const camS = useMotionValue(1);
  const saved = useRef({ x: 0, y: 0 });
  const sceneTimer = useRef<ReturnType<typeof setTimeout>>();
  const sceneTrigger = useRef<HTMLElement | null>(null);
  const press = useRef<{ x: number; y: number; t: number; vx: number; vy: number; dragging: boolean } | null>(null);
  const moved = useRef(false);

  // At least as wide as the screen and about three quarters as tall. On a phone that leaves the map
  // wider than the screen (pan to explore) with blurred sea filling the space above and below.
  const mapW = Math.max(view.w, view.h * 0.75 * MAP_ASPECT);
  const mapH = mapW / MAP_ASPECT;

  // Camera limits: the map may not leave gaps at the edges, and is centred when smaller than the screen
  const bounds = useCallback((scale: number) => {
    const axis = (view: number, size: number) => (size >= view ? { min: view - size, max: 0 } : { min: (view - size) / 2, max: (view - size) / 2 });
    const x = axis(view.w, mapW * scale);
    const y = axis(view.h, mapH * scale);
    return { minX: x.min, maxX: x.max, minY: y.min, maxY: y.max };
  }, [view, mapW, mapH]);

  const centerOn = useCallback((fx: number, fy: number, scale: number) => {
    const b = bounds(scale);
    return {
      x: clamp(view.w / 2 - fx * mapW * scale, b.minX, b.maxX),
      y: clamp(view.h / 2 - fy * mapH * scale, b.minY, b.maxY),
    };
  }, [view, mapW, mapH, bounds]);

  useEffect(() => {
    const onResize = () => setView({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Start with the crystal heart in the middle of the screen
  useEffect(() => {
    if (selected !== null) return;
    const start = centerOn(ORB_SPOTS[2][0], ORB_SPOTS[2][1], 1);
    camX.set(start.x);
    camY.set(start.y);
    camS.set(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.w, view.h]);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 7000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => clearTimeout(sceneTimer.current), []);

  const clouds = useMemo(() => CLOUDS, []);

  if (!state.character) return <Navigate to="/create" replace />;

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (selected !== null) return;
    camX.stop();
    camY.stop();
    moved.current = false;
    press.current = { x: e.clientX, y: e.clientY, t: performance.now(), vx: 0, vy: 0, dragging: false };
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (!p.dragging) {
      if (Math.hypot(dx, dy) < 6) return;
      p.dragging = true;
      moved.current = true;
      setHint(false);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const dt = Math.max(1, now - p.t);
    const b = bounds(1);
    camX.set(clamp(camX.get() + dx, b.minX, b.maxX));
    camY.set(clamp(camY.get() + dy, b.minY, b.maxY));
    p.vx = p.vx * 0.6 + (dx / dt) * 1000 * 0.4;
    p.vy = p.vy * 0.6 + (dy / dt) * 1000 * 0.4;
    p.x = e.clientX;
    p.y = e.clientY;
    p.t = now;
  };

  const onUp = () => {
    const p = press.current;
    press.current = null;
    if (!p?.dragging || reducedMotion) return;
    const b = bounds(1);
    animate(camX, camX.get(), { type: 'inertia', velocity: p.vx, power: 0.6, timeConstant: 380, min: b.minX, max: b.maxX, bounceStiffness: 200, bounceDamping: 30 });
    animate(camY, camY.get(), { type: 'inertia', velocity: p.vy, power: 0.6, timeConstant: 380, min: b.minY, max: b.maxY, bounceStiffness: 200, bounceDamping: 30 });
  };

  const openOrb = (index: number) => {
    if (moved.current) return;
    if (!isOrbUnlocked(index)) {
      setWobble(index);
      setTimeout(() => setWobble(null), 600);
      toast('Território selado', { description: `Complete a orbe anterior para abrir a ${ORBS[index].name}.` });
      return;
    }
    sceneTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    saved.current = { x: camX.get(), y: camY.get() };
    setSelected(index);
    const target = centerOn(ORB_SPOTS[index][0], ORB_SPOTS[index][1], ZOOM);
    const spring = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 70, damping: 18 };
    animate(camS, ZOOM, spring);
    animate(camX, target.x, spring);
    animate(camY, target.y, spring);
    sceneTimer.current = setTimeout(() => setSceneOpen(true), reducedMotion ? 0 : 520);
  };

  const closeScene = () => setSceneOpen(false);

  const afterClose = () => {
    const spring = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 80, damping: 20 };
    animate(camS, 1, spring);
    animate(camX, saved.current.x, spring);
    animate(camY, saved.current.y, spring);
    setSelected(null);
  };

  const pct = (n: number) => `${n * 100}%`;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[hsl(230_60%_8%)]">
      {/* Blurred copy of the map keeps the sea continuous where the map is smaller than the screen */}
      <img src={WORLD_MAP_ART} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-2xl" />
      <div className="absolute inset-0 touch-none select-none" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} style={{ cursor: selected === null ? 'grab' : 'default' }}>
        <motion.div className="absolute left-0 top-0" style={{ x: camX, y: camY, scale: camS, width: mapW, height: mapH, transformOrigin: '0 0' }}>
          <img src={WORLD_MAP_ART} alt="Mapa-múndi de Althea" draggable={false} className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]" />
          <div className="world-sea pointer-events-none absolute inset-0" />

          {/* Twinkling water */}
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} className="world-twinkle pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" style={{ left: `${(i * 47 + 9) % 98}%`, top: `${(i * 29 + 5) % 96}%`, animation: `twinkle ${2.5 + (i % 4)}s ease-in-out ${(i % 7) * 0.6}s infinite` }} />
          ))}

          {/* Clouds */}
          {clouds.map((c, i) => (
            <div key={i} className="world-cloud pointer-events-none absolute left-0 rounded-[50%] bg-white blur-2xl" style={{ top: `${c.top}%`, width: c.size, height: c.size * 0.32, ['--cloud-o' as string]: c.o, animation: `cloud-drift ${c.dur}s linear ${c.delay}s infinite` }} />
          ))}

          {/* Routes between the territories */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {ORB_SPOTS.slice(0, -1).map(([x1, y1], i) => {
              const [x2, y2] = ORB_SPOTS[i + 1];
              const open = isOrbUnlocked(i + 1);
              const mx = (x1 + x2) * 50 + (i % 2 ? 6 : -6);
              const my = (y1 + y2) * 50 - 7;
              const d = `M ${x1 * 100} ${y1 * 100} Q ${mx} ${my} ${x2 * 100} ${y2 * 100}`;
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path className="world-flow" d={d} fill="none" stroke={open ? '#ffd766' : 'rgba(255,255,255,0.35)'} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 20" vectorEffect="non-scaling-stroke" style={{ animation: 'dash-flow 1.6s linear infinite', filter: open ? 'drop-shadow(0 0 5px #ffd766)' : undefined }} />
                </g>
              );
            })}
          </svg>

          {/* Orbs */}
          {ORBS.map((orb, i) => {
            const [fx, fy] = ORB_SPOTS[i];
            const open = isOrbUnlocked(i);
            const progress = getOrbProgress(i);
            const done = progress === 100;
            const current = i === state.currentOrbIndex;
            const color = `hsl(var(--orb-${orb.id}))`;
            const total = getChallengesForOrb(orb.id).length;
            return (
              <div key={orb.id} className="absolute" style={{ left: pct(fx), top: pct(fy) }}>
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <motion.button
                    aria-label={`${orb.name}${open ? '' : ' (selada)'}`}
                    onClick={event => { if (event.detail === 0) moved.current = false; openOrb(i); }}
                    className="group relative flex h-28 w-28 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={selected === i ? { scale: 1.15, opacity: 1 } : selected !== null ? { scale: 0.85, opacity: 0.35 } : wobble === i ? { x: [0, -8, 8, -6, 6, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    transition={wobble === i ? { duration: 0.5 } : { type: 'spring', stiffness: 200, damping: 14, delay: selected === null ? 0.3 + i * 0.12 : 0 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    {/* Glow and rotating rune ring */}
                    <span className="world-breathe absolute inset-1 rounded-full blur-xl" style={{ background: color, animation: 'orb-breathe 3.2s ease-in-out infinite', animationDelay: `${i * 0.5}s`, opacity: open ? undefined : 0.15 }} />
                    <span className="world-halo absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: color, opacity: open ? 0.9 : 0.25, animation: `halo-spin ${14 + i * 2}s linear infinite` }} />
                    <span className="world-halo absolute inset-3 rounded-full border border-white/40" style={{ animation: `halo-spin ${9 + i}s linear infinite reverse` }} />
                    <motion.img
                      src={ORB_ART[orb.id]}
                      alt=""
                      draggable={false}
                      className={`relative h-20 w-20 object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)] ${open ? '' : 'grayscale-[0.75] brightness-75'}`}
                      animate={reducedMotion ? {} : { y: [0, -8, 0] }}
                      transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    />
                    {!open && <span className="rune-socket absolute h-9 w-9"><RpgIcon name="lock" size={17} /></span>}
                    {done && <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--gold))] text-sm font-bold text-accent-foreground shadow-[0_0_12px_hsl(var(--gold))]">✓</span>}
                  </motion.button>

                  {/* Name plate */}
                  <div className="pointer-events-none -mt-1 flex flex-col items-center">
                    <span className="whitespace-nowrap rounded-full border border-[hsl(var(--gold-deep))] bg-black/70 px-3 py-0.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-foreground backdrop-blur" style={{ boxShadow: open ? `0 0 14px ${color}` : undefined }}>
                      {orb.name}
                    </span>
                    {open && <span className="mt-0.5 font-display text-[10px] font-bold text-accent drop-shadow-[0_1px_2px_black]">{Math.round((progress / 100) * total)}/{total}</span>}
                  </div>

                  {current && selected === null && (
                    <motion.div className="pointer-events-none absolute -top-16 left-1/2 flex -translate-x-1/2 flex-col items-center" animate={reducedMotion ? {} : { y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <img src={CHARACTER_ART.mage} alt="" className="h-14 w-10 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]" />
                      <span className="rounded-full bg-accent px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-accent-foreground">Você está aqui</span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Title and hint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-background/90 via-background/50 to-transparent px-4 pb-8 text-center" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}>
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Link to="/atlas" className="pointer-events-auto inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-accent/40 bg-background/80 px-3 font-display text-xs text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"><RpgIcon name="map" size={16} /> Atlas</Link>
          <div className="min-w-0 flex-1 pr-12">
            <h1 className="text-gold font-title text-base font-bold sm:text-xl">Mundo das Cinco Orbes</h1>
            <p className="mt-1 font-body text-[10px] text-foreground/80">Jornada do Autoconhecimento</p>
          </div>
        </div>
        <OrnateDivider className="mt-1.5" />
        <div role="group" aria-label="Explorar continentes" className="pointer-events-auto mx-auto mt-3 flex max-w-2xl gap-2 overflow-x-auto pb-2">
          {ORBS.map((orb, index) => (
            <button key={orb.id} disabled={!isOrbUnlocked(index)} onClick={() => { moved.current = false; openOrb(index); }} className="min-h-11 shrink-0 rounded-full border border-accent/40 bg-background/85 px-3 font-display text-[10px] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50">
              {orb.name}{!isOrbUnlocked(index) && ' · Selada'}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {hint && selected === null && (
          <motion.p
            className="pointer-events-none absolute inset-x-0 bottom-28 mx-auto w-fit rounded-full border border-[hsl(var(--gold-deep))] bg-black/70 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-accent backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ delay: 1.2 }}
          >
            Arraste o mapa · toque numa orbe
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence onExitComplete={afterClose}>
        {sceneOpen && selected !== null && (
          <ContinentScene key={ORBS[selected].id} orb={ORBS[selected]} orbIndex={selected} origin={{ x: view.w / 2, y: view.h / 2 }} onClose={closeScene} onReturnFocus={() => sceneTrigger.current?.focus({ preventScroll: true })} />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
