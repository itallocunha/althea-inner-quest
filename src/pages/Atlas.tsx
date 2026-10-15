import { useCallback, useRef, useState, type PointerEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Compass, Globe2, LockKeyhole, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useGame } from '@/context/GameContext';
import { ATLAS_WORLDS } from '@/data/atlasWorlds';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { ATLAS_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';
import { AtlasBackdrop } from '@/components/atlas/AtlasBackdrop';
import { AtlasEntry, type AtlasDeparture } from '@/components/atlas/AtlasEntry';
import './Atlas.css';

const challenges = ORBS.flatMap(orb => getChallengesForOrb(orb.id));
const MOTION_KEY = 'althea-atlas-motion';
function loadMotionPreference(): 'system' | 'full' | 'reduced' {
  try { const value = localStorage.getItem(MOTION_KEY); return value === 'full' || value === 'reduced' ? value : 'system'; }
  catch { return 'system'; }
}

export default function Atlas() {
  const { state } = useGame();
  const navigate = useNavigate();
  const planetRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastTap = useRef<{ id: string; time: number; x: number; y: number } | null>(null);
  const pendingDestination = useRef<string | null>(null);
  const [departure, setDeparture] = useState<AtlasDeparture | null>(null);
  const systemReducedMotion = useReducedMotion();
  const [motionPreference, setMotionPreference] = useState(loadMotionPreference);
  const reducedMotion = motionPreference === 'system' ? !!systemReducedMotion : motionPreference === 'reduced';
  const toggleMotion = () => {
    const preference = reducedMotion ? 'full' : 'reduced';
    setMotionPreference(preference);
    try { localStorage.setItem(MOTION_KEY, preference); } catch { /* The choice still works for this visit. */ }
  };
  const detailsRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string>(ATLAS_WORLDS[0].id);
  const selected = ATLAS_WORLDS.find(world => world.id === selectedId) ?? ATLAS_WORLDS[0];
  const completed = challenges.filter(challenge => state.challengeProgress[challenge.id]?.completed).length;
  const progress = Math.round(completed / challenges.length * 100);
  const resume = state.character ? getJourneyResume(state) : null;

  const finishEntry = useCallback(() => {
    const destination = pendingDestination.current;
    if (!destination) return;
    pendingDestination.current = null;
    navigate(destination);
  }, [navigate]);

  const enterWorld = (world: (typeof ATLAS_WORLDS)[number]) => {
    if (pendingDestination.current) return;
    setSelectedId(world.id);
    if (!world.available) return;
    const destination = state.character ? '/world' : '/create';
    if (reducedMotion) { navigate(destination); return; }
    const sphere = planetRefs.current.get(world.id)?.querySelector('.atlas-planet-sphere');
    const bounds = sphere?.getBoundingClientRect();
    const visible = bounds && bounds.width > 0 && bounds.bottom > 0 && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth;
    pendingDestination.current = destination;
    setDeparture({
      x: visible ? bounds.left + bounds.width / 2 : window.innerWidth / 2,
      y: visible ? bounds.top + bounds.height / 2 : window.innerHeight * .44,
      diameter: visible ? bounds.width : 120,
      name: world.name,
    });
  };

  const tapPlanet = (event: PointerEvent<HTMLButtonElement>, world: (typeof ATLAS_WORLDS)[number]) => {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
    const previous = lastTap.current;
    const now = performance.now();
    if (previous?.id === world.id && now - previous.time < 340 && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 24) {
      lastTap.current = null;
      enterWorld(world);
    } else {
      lastTap.current = { id: world.id, time: now, x: event.clientX, y: event.clientY };
    }
  };

  return (
    <div className="atlas-page" data-motion={reducedMotion ? 'reduced' : 'full'}>
      <AtlasBackdrop />

      <header className="atlas-header">
        <p className="atlas-eyebrow"><Compass size={15} aria-hidden="true" /> Cartografia dos mundos</p>
        <h1>Atlas de Althea</h1>
        <p>Cada mundo, uma jornada. Cada jornada, uma descoberta.</p>
        <button type="button" role="switch" aria-label="Animações do Atlas" aria-checked={!reducedMotion} onClick={toggleMotion} className="atlas-motion-toggle">
          <Sparkles size={14} aria-hidden="true" /><span>{reducedMotion ? 'Movimento reduzido' : 'Animações ativas'}</span><i aria-hidden="true" />
        </button>
      </header>

      <main className="atlas-layout">
        <section className="atlas-system" aria-labelledby="atlas-system-title">
          <h2 id="atlas-system-title" className="sr-only">Escolha um mundo</h2>
          <div className="atlas-system-topline"><span>Sistema de Althea</span><span>01 mundo disponível</span></div>
          <div className="atlas-sky" role="group" aria-label="Planetas do Atlas">
            <div className="atlas-orbits" aria-hidden="true"><i /><i /><i /></div>
            <div className="atlas-sun" aria-hidden="true">✧</div>
            {ATLAS_WORLDS.map(world => (
              <button
                key={world.id}
                type="button"
                ref={node => { if (node) planetRefs.current.set(world.id, node); else planetRefs.current.delete(world.id); }}
                className={`atlas-planet atlas-planet--${world.id}`}
                aria-label={`Selecionar ${world.name} — ${world.available ? 'Disponível' : 'Em breve'}`}
                aria-pressed={selected.id === world.id}
                aria-controls="atlas-world-info"
                onClick={() => setSelectedId(world.id)}
                onDoubleClick={() => enterWorld(world)}
                onPointerUp={event => tapPlanet(event, world)}
                disabled={departure !== null}
              >
                <span className="atlas-planet-body" aria-hidden="true">
                  <span className="atlas-planet-sphere">
                    <span className="atlas-planet-surface" style={world.id === 'five-orbs' ? { backgroundImage: 'url(' + ATLAS_ART.fiveOrbsSurface + ')' } : undefined} />
                  </span>
                  <span className="atlas-planet-ring" />
                  <span className="atlas-planet-moon" />
                </span>
                <span className="atlas-planet-name">{world.label}</span>
                <span className={`atlas-planet-status ${world.available ? 'is-available' : ''}`}>
                  {world.available ? 'Disponível' : 'Em breve'}
                </span>
              </button>
            ))}
          </div>
          <div className="atlas-system-caption">
            <p>Selecione para conhecer · dois toques rápidos para entrar.</p>
            <button type="button" onClick={() => {
              detailsRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
              detailsRef.current?.focus({ preventScroll: true });
            }}>Ver mundo selecionado <ArrowDown size={14} aria-hidden="true" /></button>
          </div>
        </section>

        <section ref={detailsRef} id="atlas-world-info" className="atlas-world-info" aria-labelledby="atlas-world-name" tabIndex={-1}>
          <p className="sr-only" role="status">{selected.name}. {selected.available ? 'Disponível' : 'Em breve'}.</p>
          <div className="atlas-detail-topline">
            <span className="atlas-eyebrow"><Globe2 size={14} aria-hidden="true" /> Mundo selecionado</span>
            <span className={`atlas-availability ${selected.available ? 'is-available' : ''}`}>
              {selected.available ? <Sparkles size={13} aria-hidden="true" /> : <LockKeyhole size={13} aria-hidden="true" />}
              {selected.available ? 'Disponível' : 'Em breve'}
            </span>
          </div>
          <h2 id="atlas-world-name">{selected.name}</h2>
          <p className="atlas-journey-name">{selected.journey}</p>
          <p className="atlas-description">{selected.description}</p>

          <h3 className="atlas-knowledge-title">{selected.available ? 'Conhecimentos trabalhados' : 'Temas previstos'}</h3>
          <ul className="atlas-knowledge">
            {selected.knowledge.map(item => <li key={item}><span aria-hidden="true">✦</span>{item}</li>)}
          </ul>

          {selected.available ? (
            <>
              {resume && (
                <div className="atlas-progress">
                  <div><span>Sua travessia</span><strong>{progress}%</strong></div>
                  <div role="progressbar" aria-label="Progresso da Jornada do Autoconhecimento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="atlas-progress-track"><span style={{ width: `${progress}%` }} /></div>
                  <p>{completed} de {challenges.length} desafios concluídos</p>
                  <p className="atlas-resume-label">{resume.orb.name} · {resume.label}</p>
                </div>
              )}
              <div className="atlas-actions">
                <Link className="atlas-action-primary" to={state.character ? '/world' : '/create'} aria-disabled={departure ? true : undefined} onClick={event => {
                  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  enterWorld(selected);
                }}>
                  Entrar no mundo <ArrowRight size={17} aria-hidden="true" />
                </Link>
                {resume ? (
                  <Link className="atlas-action-secondary" to={resume.destination}>Continuar aventura <Compass size={16} aria-hidden="true" /></Link>
                ) : (
                  <p className="atlas-onboarding">Seu primeiro passo: criar um herói para explorar os cinco continentes.</p>
                )}
              </div>
              <p className="atlas-world-note">{selected.note}</p>
            </>
          ) : (
            <div className="atlas-coming-soon"><LockKeyhole size={19} aria-hidden="true" /><p>{selected.note}</p></div>
          )}
        </section>
      </main>
      <footer className="atlas-footer"><span aria-hidden="true">✧</span> Mundos a descobrir. Histórias a viver.</footer>
      <BottomNav />
      {departure && <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}><AtlasEntry origin={departure} reducedMotion={reducedMotion} onComplete={finishEntry} /></MotionConfig>}
    </div>
  );
}
