import { forwardRef, useEffect, useMemo, useRef, useState, useCallback, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { animate, motion, MotionConfig, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, X } from 'lucide-react';
import { LOGO_ART, ORB_ART } from '@/lib/journeyAssets';
import type { OrbId } from '@/types/game';
import type { RpgIconName } from './RpgIcon';
import { ArtifactSigil } from './ArtifactSigil';
import { OrnateDivider } from './Ornaments';
import { OrbBurstEffects, ProjectionAtmosphere, type OrbBurst } from './CardProjectionEffects';

export interface Card3DData {
  name: string;
  description?: string;
  badge: string;
  icon?: string;
  iconName?: RpgIconName;
  image?: string;
  gradient?: string;
  color?: string;
  orbId?: OrbId;
  backTitle?: string;
  backDescription?: string;
  footer?: ReactNode;
}

interface Card3DViewerProps {
  card: Card3DData | null;
  origin?: DOMRect | null;
  onClose: () => void;
}

const CARD_W = 280;
const CARD_H = 392;
const DEPTH = 12;
const START_X = -6;
const START_Y = -20;
const MAX_TILT = 75;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const normalizedAngle = (angle: number) => ((angle % 360) + 360) % 360;

function CardObject({ card, fit, onBurst, animated }: { card: Card3DData; fit: number; onBurst: (x: number, y: number) => void; animated: boolean }) {
  const reduced = !animated;
  const rotX = useMotionValue(reduced ? 0 : START_X);
  const rotY = useMotionValue(reduced ? 0 : START_Y);
  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [face, setFace] = useState<'front' | 'back'>('front');
  const objectRef = useRef<HTMLDivElement>(null);
  const suppressClick = useRef(false);
  const drag = useRef<{ startX: number; startY: number; x: number; y: number; t: number; vx: number; vy: number; moved: boolean } | null>(null);

  useMotionValueEvent(rotY, 'change', value => {
    const angle = normalizedAngle(value);
    setFace(angle > 90 && angle < 270 ? 'back' : 'front');
  });

  useEffect(() => {
    if (touched || reduced) return;
    const sway = animate(rotY, [START_Y - 8, START_Y + 14], { duration: 4.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });
    return () => sway.stop();
  }, [touched, reduced, rotY]);

  useEffect(() => () => { rotX.stop(); rotY.stop(); }, [rotX, rotY]);

  useEffect(() => { if (reduced) { rotX.stop(); rotY.stop(); } }, [reduced, rotX, rotY]);

  const stopRotation = () => {
    rotX.stop();
    rotY.stop();
    setTouched(true);
  };

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    stopRotation();
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, t: performance.now(), vx: 0, vy: 0, moved: false };
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;
    if (!current.moved && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 5) return;
    current.moved = true;
    setDragging(true);
    const now = performance.now();
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    const dt = Math.max(1, now - current.t);
    rotY.set(rotY.get() + dx * .7 / fit);
    rotX.set(clamp(rotX.get() - dy * .55 / fit, -MAX_TILT, MAX_TILT));
    current.vx = current.vx * .6 + dx * .7 / fit / dt * 400;
    current.vy = current.vy * .6 - dy * .55 / fit / dt * 400;
    current.x = event.clientX;
    current.y = event.clientY;
    current.t = now;
  };

  const onUp = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const current = drag.current;
    drag.current = null;
    setDragging(false);
    if (!current) return;
    suppressClick.current = current.moved || cancelled;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (current.moved && !cancelled && !reduced) {
      const releaseAge = performance.now() - current.t;
      const velocityScale = Math.max(0, 1 - releaseAge / 120);
      animate(rotY, rotY.get(), { type: 'inertia', velocity: current.vx * velocityScale, power: .35, timeConstant: 300 });
      animate(rotX, rotX.get(), { type: 'inertia', velocity: current.vy * velocityScale, power: .2, timeConstant: 240, min: -MAX_TILT, max: MAX_TILT, bounceStiffness: 260, bounceDamping: 30 });
    }
  };

  const emitFromCenter = () => {
    const rect = objectRef.current?.getBoundingClientRect();
    if (rect) onBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const turnTo = (target: 'front' | 'back') => {
    stopRotation();
    const base = target === 'back' ? 180 : 0;
    const angle = base + Math.round((rotY.get() - base) / 360) * 360;
    if (reduced) { rotX.set(0); rotY.set(angle); }
    else {
      animate(rotX, START_X, { type: 'spring', stiffness: 100, damping: 20 });
      animate(rotY, angle, { type: 'spring', stiffness: 95, damping: 19 });
    }
  };

  const reset = () => {
    stopRotation();
    const angle = START_Y + Math.round((rotY.get() - START_Y) / 360) * 360;
    if (reduced) { rotX.set(0); rotY.set(0); }
    else {
      animate(rotX, START_X, { type: 'spring', stiffness: 120, damping: 20 });
      animate(rotY, angle, { type: 'spring', stiffness: 120, damping: 20 });
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      stopRotation();
      if (event.key === 'ArrowLeft') rotY.set(rotY.get() - 30);
      if (event.key === 'ArrowRight') rotY.set(rotY.get() + 30);
      if (event.key === 'ArrowUp') rotX.set(clamp(rotX.get() + 15, -MAX_TILT, MAX_TILT));
      if (event.key === 'ArrowDown') rotX.set(clamp(rotX.get() - 15, -MAX_TILT, MAX_TILT));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      emitFromCenter();
    } else if (event.key === 'Home') {
      event.preventDefault();
      reset();
    }
  };

  const glarePos = useTransform(rotY, value => `${50 - (normalizedAngle(value + 180) - 180) * .5}% 50%`);
  const glareOpacity = useTransform(rotX, value => .15 + Math.abs(value) / 350);
  const edges = useMemo(() => Array.from({ length: 8 }, (_, index) => -DEPTH / 2 + (index + 1) * DEPTH / 9), []);
  const theme = { '--projection-color': card.color || '275 65% 68%' } as CSSProperties;

  return <>
    <div className="card3d-model-space" style={{ width: CARD_W * fit, height: CARD_H * fit }}>
      <div style={{ width: CARD_W, height: CARD_H, transform: `scale(${fit})`, transformOrigin: 'top left', perspective: 1200 }}>
        <div ref={objectRef} role="button" tabIndex={0} aria-label={`Carta 3D de ${card.name}. Arraste para girar ou use as setas. Clique para liberar orbes.`}
          className="card3d-object" data-testid="card-3d-object" data-facing={face} style={{ ...theme, cursor: dragging ? 'grabbing' : 'grab' }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={event => onUp(event)} onPointerCancel={event => onUp(event, true)}
          onLostPointerCapture={() => { drag.current = null; setDragging(false); }} onKeyDown={onKeyDown}
          onClick={event => {
            if (suppressClick.current) { suppressClick.current = false; return; }
            if (event.detail === 0) emitFromCenter(); else onBurst(event.clientX, event.clientY);
          }}>
          <motion.div className="card3d-solid" style={{ rotateX: rotX, rotateY: rotY }}>
            {edges.map(z => <div key={z} className="card3d-edge" style={{ transform: `translateZ(${z}px)` }} />)}
            <div className={`card3d-face card3d-front ${card.image ? 'has-art' : ''}`} aria-hidden={face !== 'front'} style={{ transform: `translateZ(${DEPTH / 2}px)` }}>
              {card.image ? <img src={card.image} alt={card.name} className="card3d-original-art" draggable={false} /> : <>
                <div className="card3d-illustration" style={card.gradient ? { background: card.gradient } : undefined}>
                  {card.iconName ? <ArtifactSigil icon={card.iconName} color={card.color} /> : <span className="text-7xl drop-shadow-lg">{card.icon || '✦'}</span>}
                </div>
                <div className="card3d-card-copy"><span className="card3d-card-badge">{card.badge}</span><h3>{card.name}</h3><OrnateDivider className="my-2 scale-75" /><p>{card.description}</p></div>
              </>}
              <motion.div className="card3d-foil" style={{ backgroundPosition: glarePos, opacity: glareOpacity }} />
            </div>
            <div className="card3d-face card3d-back" aria-hidden={face !== 'back'} style={{ transform: `rotateY(180deg) translateZ(${DEPTH / 2}px)` }}>
              <div className="card3d-back-border" />
              <div className="card3d-back-seal" />
              <img src={LOGO_ART.title} alt="Althea" className="card3d-back-logo" draggable={false} />
              <p className="card3d-back-type">{card.badge}</p>
              <div className="card3d-back-copy"><h3>{card.backTitle || card.name}</h3><OrnateDivider className="my-3 scale-75" /><p>{card.backDescription || 'Uma carta da sua lenda em Althea. Cada descoberta carrega o poder de uma nova aventura.'}</p></div>
              <div className="card3d-back-orbs">{(['blue', 'green', 'purple', 'red', 'yellow'] as const).map(orb => <img key={orb} src={ORB_ART[orb]} alt="" draggable={false} />)}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    <div className="card3d-controls" role="group" aria-label="Controles de rotação da carta">
      <button onClick={() => turnTo('front')} aria-pressed={face === 'front'}><ArrowLeft size={14} /> Ver frente</button>
      <button onClick={() => turnTo('back')} aria-pressed={face === 'back'}>Ver verso <ArrowRight size={14} /></button>
      <button onClick={reset} aria-label="Recentralizar carta"><RotateCcw size={16} /></button>
      <button onClick={emitFromCenter} aria-label="Liberar partículas de orbe"><Sparkles size={16} /></button>
    </div>
  </>;
}

const ProjectionStage = forwardRef<HTMLDivElement, { card: Card3DData; origin?: DOMRect | null; onClose: () => void }>(function ProjectionStage({ card, origin, onClose }, ref) {
  // Magic starts active as requested; the player can lower the effects in this viewer.
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [bursts, setBursts] = useState<OrbBurst[]>([]);
  const burstId = useRef(0);
  const pressedBackdrop = useRef(false);
  const fit = Math.max(.2, Math.min(1, (viewport.height - (card.footer ? 320 : 275)) / CARD_H, (viewport.width - 64) / CARD_W));

  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const removeBurst = useCallback((id: number) => setBursts(previous => previous.filter(burst => burst.id !== id)), []);
  const emitBurst = (x: number, y: number) => {
    const burst = { id: ++burstId.current, x, y };
    setBursts(previous => [...previous.slice(-4), burst]);
  };

  return <MotionConfig reducedMotion={effectsEnabled ? 'never' : 'always'}><DialogPrimitive.Content ref={ref} className="card3d-stage" data-effects={effectsEnabled ? 'active' : 'reduced'} style={{ '--projection-color': card.color || '275 65% 68%' } as CSSProperties}
    onPointerDown={event => { pressedBackdrop.current = event.target === event.currentTarget; }}
    onClick={event => { if (pressedBackdrop.current && event.target === event.currentTarget) onClose(); pressedBackdrop.current = false; }}>
    <ProjectionAtmosphere animated={effectsEnabled} />
    <OrbBurstEffects bursts={bursts} onComplete={removeBurst} animated={effectsEnabled} />
    <button className="card3d-effects-toggle" aria-label={effectsEnabled ? 'Reduzir efeitos mágicos' : 'Ativar efeitos mágicos'} aria-pressed={effectsEnabled} onClick={() => setEffectsEnabled(enabled => !enabled)}><Sparkles size={14} /> Efeitos</button>
    <DialogPrimitive.Close className="card3d-close" aria-label="Fechar"><X size={20} /></DialogPrimitive.Close>
    <motion.div className="card3d-presentation" initial={{ opacity: 0, y: origin ? clamp(origin.top + origin.height / 2 - viewport.height / 2, -150, 150) : 35, scale: .75 }}
      animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 22 }}>
      <header className="card3d-heading"><p className="archive-eyebrow">{card.badge} · Projeção arcana</p><DialogPrimitive.Title className="font-title text-lg text-[#f3dfb8]">{card.name}</DialogPrimitive.Title></header>
      <CardObject card={card} fit={fit} onBurst={emitBurst} animated={effectsEnabled} />
      <DialogPrimitive.Description className="card3d-instructions">Arraste para girar em 360°. Toque na carta para liberar orbes.<span>No teclado: setas para girar, Enter para liberar orbes.</span></DialogPrimitive.Description>
      {card.footer && <div className="card3d-footer">{card.footer}</div>}
    </motion.div>
  </DialogPrimitive.Content></MotionConfig>;
});

/** Shared projection for reward, race, class and illustrated medal cards. */
export function Card3DViewer({ card, origin, onClose }: Card3DViewerProps) {
  return <DialogPrimitive.Root open={!!card} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="card3d-overlay" />
      {card && <ProjectionStage key={card.name} card={card} origin={origin} onClose={onClose} />}
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}
