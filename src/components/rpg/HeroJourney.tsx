import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Compass, LockKeyhole, Map, MapPin } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { ORB_ART, ORB_CONTINENT_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';
import './HeroJourney.css';

/** The book follows the existing journey; inspecting a territory never changes progress. */
export function HeroJourney() {
  const { state } = useGame();
  const resume = getJourneyResume(state);
  const currentIndex = Math.min(state.currentOrbIndex, ORBS.length - 1);
  const [selectedId, setSelectedId] = useState(resume.orb.id);
  const selectedIndex = ORBS.findIndex(orb => orb.id === selectedId);
  const selected = ORBS[selectedIndex];
  const selectedChallenges = getChallengesForOrb(selected.id);
  const completed = selectedChallenges.filter(challenge => state.challengeProgress[challenge.id]?.completed).length;
  const total = ORBS.reduce((sum, orb) => sum + getChallengesForOrb(orb.id).length, 0);
  const completedTotal = ORBS.reduce((sum, orb) => sum + getChallengesForOrb(orb.id).filter(challenge => state.challengeProgress[challenge.id]?.completed).length, 0);
  const allComplete = completedTotal === total;
  const selectedUnlocked = selectedIndex <= currentIndex;

  return <section className="hero-book-journey" aria-labelledby="hero-journey-title">
    <header className="hero-book-journey-heading">
      <div><p className="hero-book-journey-kicker">Capítulo III · Os caminhos percorridos</p><h2 id="hero-journey-title">Sua jornada, entre as orbes</h2><p>Cada território guarda uma descoberta sobre você.</p></div>
      <span className="hero-book-journey-tally"><Compass size={20} /><strong>{completedTotal}<small>/{total}</small></strong><span>desafios vividos</span></span>
    </header>

    <div className="hero-book-journey-location" role="status"><MapPin size={17} /><span>{allComplete ? 'Os cinco territórios foram concluídos.' : <>Você está em <strong>{resume.orb.name}</strong> · {resume.label}</>}</span></div>

    <ol className="hero-book-journey-trail" aria-label="Trajetória pelos cinco territórios">
      {ORBS.map((orb, index) => {
        const challenges = getChallengesForOrb(orb.id);
        const count = challenges.filter(challenge => state.challengeProgress[challenge.id]?.completed).length;
        const done = count === challenges.length;
        const unlocked = index <= currentIndex;
        const current = index === currentIndex && !allComplete;
        const status = done ? 'Concluída' : current ? 'Você está aqui' : unlocked ? 'Liberada' : 'Ainda selada';
        return <li key={orb.id} className={`${current ? 'is-current' : ''} ${done ? 'is-complete' : ''} ${!unlocked ? 'is-sealed' : ''}`}>
          <button type="button" className={selectedId === orb.id ? 'is-selected' : ''} onClick={() => setSelectedId(orb.id)} aria-pressed={selectedId === orb.id} aria-label={`Explorar ${orb.name}: ${count} de ${challenges.length} desafios. ${status}`} style={{ '--journey-orb-color': `hsl(var(--orb-${orb.id}))` } as CSSProperties}>
            <span className="hero-book-journey-orb"><img src={ORB_ART[orb.id]} alt="" loading="lazy" /><span className="hero-book-journey-orb-seal">{done ? <Check size={13} /> : !unlocked ? <LockKeyhole size={12} /> : <span>{index + 1}</span>}</span></span>
            <span className="hero-book-journey-orb-name">{orb.name}</span><span className="hero-book-journey-orb-count">{count}/{challenges.length}</span><small>{status}</small>
          </button>
        </li>;
      })}
    </ol>

    <div className="hero-book-journey-territory" key={selected.id}>
      <div className="hero-book-journey-landscape"><img src={ORB_CONTINENT_ART[selected.id]} alt={`Mapa artístico do território ${selected.name}`} loading="lazy" /><span>{selectedUnlocked ? 'Um lugar na sua história' : 'Um caminho por descobrir'}</span></div>
      <div className="hero-book-journey-territory-copy">
        <p className="hero-book-journey-kicker">Território {selectedIndex + 1} de {ORBS.length}</p><h3>{selected.name}</h3><p className="hero-book-journey-question">{selected.theme}</p><p>{selected.focus}.<br /><span className="hero-book-journey-develops">Cultive {selected.develops.toLocaleLowerCase('pt-BR')}.</span></p>
        <div className="hero-book-journey-progress"><span>{completed} de {selectedChallenges.length} desafios concluídos</span><strong>{Math.round(completed / selectedChallenges.length * 100)}%</strong><progress value={completed} max={selectedChallenges.length} aria-label={`Progresso em ${selected.name}`} /></div>
        {selectedUnlocked ? <Link to={`/portfolio/${selected.id}`} className="hero-book-journey-text-link">Rever minhas conquistas <ArrowRight size={15} /></Link> : <p className="hero-book-journey-locked-note"><LockKeyhole size={15} /> Conclua os territórios anteriores para abrir este caminho.</p>}
      </div>
    </div>

    <footer className="hero-book-journey-next">
      <div><p className="hero-book-journey-kicker">{allComplete ? 'Uma jornada para recordar' : 'O próximo passo da sua aventura'}</p><strong>{resume.challenge?.title || 'Revisite suas descobertas'}</strong><span>{allComplete ? 'Suas conquistas continuam no livro.' : `${resume.orb.name} · ${resume.label}`}</span></div>
      <div className="hero-book-journey-actions"><Link to={resume.destination} className="hero-book-journey-continue">{allComplete ? 'Revisitar aventura' : 'Continuar aventura'} <ArrowRight size={16} /></Link><Link to="/world" className="hero-book-journey-text-link"><Map size={16} /> Mapa dos continentes</Link></div>
    </footer>
  </section>;
}
