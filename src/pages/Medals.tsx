import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { CardDetailModal } from '@/components/CardDetailModal';
import { ConstellationAtmosphere, ConstellationHeader, OrbSelector, orbStyle } from '@/components/rpg/ConstellationUI';
import { Button } from '@/components/ui/button';
import { RpgIcon, type RpgIconName } from '@/components/rpg/RpgIcon';
import { ALL_CHALLENGES, ORBS } from '@/data/gameData';
import { ORB_ART, getMedalArt } from '@/lib/journeyAssets';
import type { Challenge, OrbId } from '@/types/game';

const MEDAL_RUNES: RpgIconName[] = ['mirror', 'quill', 'eye', 'star', 'shield', 'tree', 'compass', 'flame', 'wings', 'crown'];

export default function Medals() {
  const { state } = useGame();
  const reduced = useReducedMotion();
  const [animated, setAnimated] = useState(true);
  const [orbFilter, setOrbFilter] = useState<OrbId | null>(null);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<Challenge | null>(null);
  if (!state.character) return <Navigate to="/" replace />;
  const unlocked = new Set(state.unlockedMedals);
  const visibleOrbs = ORBS.filter(orb => !orbFilter || orb.id === orbFilter);
  return <div className="constellation-page medal-hall" data-animated={animated && !reduced}>
    <ConstellationAtmosphere animated={animated && !reduced} />
    <ConstellationHeader title="Salão de Medalhas" eyebrow="Cinco Orbes · Uma trajetória" count={`${unlocked.size} de ${ALL_CHALLENGES.length} honrarias conquistadas`} animated={animated && !reduced} onToggle={() => setAnimated(value => !value)} />
    <main className="constellation-content">
      <OrbSelector selected={orbFilter} onSelect={setOrbFilter} />
      <div className={`medal-columns ${orbFilter ? 'is-focused' : ''}`}>
        {visibleOrbs.map(orb => {
          const medals = ALL_CHALLENGES.filter(challenge => challenge.orbId === orb.id);
          const count = medals.filter(challenge => unlocked.has(challenge.medalName)).length;
          return <section key={orb.id} className="medal-column" style={orbStyle(orb.id)} aria-label={`Medalhas da ${orb.name}`}>
            <header className="medal-orb-heading">
              <img src={ORB_ART[orb.id]} alt={`Orbe ${orb.name}`} />
              <h2>{orb.name}</h2><p>{orb.focus}</p>
              <span>{count} / {medals.length} conquistadas</span>
              <div className="medal-orb-progress" role="progressbar" aria-label={`Progresso da ${orb.name}`} aria-valuenow={count} aria-valuemin={0} aria-valuemax={medals.length}><i style={{ width: `${count / medals.length * 100}%` }} /></div>
            </header>
            <div className="medal-rune-grid">
              {medals.map(medal => {
                const isUnlocked = unlocked.has(medal.medalName);
                return <div key={medal.id} className={`medal-rune ${isUnlocked ? 'is-earned' : 'is-locked'}`}>
                  <Button variant="ghost" className="medal-rune-button" disabled={!isUnlocked} aria-label={`Inspecionar medalha ${medal.medalName}`} title={isUnlocked ? medal.medalName : `${medal.medalName} · ${medal.title}`} onClick={event => { setOrigin(event.currentTarget.getBoundingClientRect()); setSelected(medal); }}>
                    <RpgIcon name={MEDAL_RUNES[medal.index % MEDAL_RUNES.length]} size={34} />
                    <span className="medal-rune-status">{isUnlocked ? <Check /> : <Lock />}</span>
                  </Button>
                  <h3>{medal.medalName}</h3>
                  <span className="medal-rune-xp">{isUnlocked ? `+${medal.xpReward} XP` : `Desafio ${medal.index + 1}`}</span>
                </div>;
              })}
            </div>
          </section>;
        })}
      </div>
    </main>
    <CardDetailModal origin={origin} open={!!selected} onClose={() => setSelected(null)} type="medal" data={selected ? { orbId: selected.orbId, icon: '🏅', image: getMedalArt(selected.orbId, selected.id), name: selected.medalName, challengeName: selected.title, xp: selected.xpReward, orbLabel: ORBS.find(orb => orb.id === selected.orbId)?.name } : null} />
    <BottomNav />
  </div>;
}
