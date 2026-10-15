import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { CollectionSearch, RewardViewer } from '@/components/rpg/CollectionUI';
import { ConstellationAtmosphere, ConstellationHeader, OrbSelector } from '@/components/rpg/ConstellationUI';
import { SkillWeb } from '@/components/rpg/SkillWeb';
import { Button } from '@/components/ui/button';
import { ORBS } from '@/data/gameData';
import { COLLECTION_CATALOG, getRewardPresentation, matchesCollectionSearch } from '@/lib/collectionPresentation';
import type { OrbId, SkillCard } from '@/types/game';

export default function Grimoire() {
  const { state, toggleFavoriteCard } = useGame();
  const reduced = useReducedMotion();
  const [animated, setAnimated] = useState(true);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<SkillCard | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [orbFilter, setOrbFilter] = useState<OrbId | null>(null);
  if (!state.character) return <Navigate to="/" replace />;
  const favorites = state.favoriteCardIds || [];
  const earnedIds = new Set(state.skillCards.map(card => card.id));
  const catalog = [...new Map([...COLLECTION_CATALOG.filter((card): card is SkillCard => card.type === 'skill'), ...state.skillCards].map(card => [card.id, card])).values()];
  const cards = catalog.filter(card => matchesCollectionSearch(card, query) && (filter === 'Todas' || (filter === 'Favoritas' ? favorites.includes(card.id) : filter === 'Passivas' ? card.passive : !card.passive)));
  const visibleOrbs = ORBS.filter(orb => !orbFilter || orb.id === orbFilter);
  return <div className="constellation-page" data-animated={animated && !reduced}>
    <ConstellationAtmosphere animated={animated && !reduced} />
    <ConstellationHeader title="Grimório de Habilidades" eyebrow="Constelações do conhecimento" count={`${state.skillCards.length} habilidades despertadas · 5 Orbes`} animated={animated && !reduced} onToggle={() => setAnimated(value => !value)} />
    <main className="constellation-content">
      <div className="constellation-toolbar">
        <CollectionSearch value={query} onChange={setQuery} placeholder="Buscar uma habilidade…" />
        <div className="constellation-filters" role="group" aria-label="Filtrar habilidades">{['Todas', 'Passivas', 'Ativas', 'Favoritas'].map(option => <Button key={option} variant="ghost" size="sm" aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</Button>)}</div>
      </div>
      <OrbSelector selected={orbFilter} onSelect={setOrbFilter} />
      <div className={`skill-forest ${orbFilter ? 'is-focused' : ''}`}>
        {visibleOrbs.map(orb => <SkillWeb key={orb.id} orb={orb} cards={cards.filter(card => (getRewardPresentation(card).orb?.id || 'purple') === orb.id)} earnedIds={earnedIds} favorites={favorites} onSelect={(card, rect) => { setOrigin(rect); setSelected(card); }} />)}
      </div>
      {cards.length === 0 && <p className="constellation-empty">Nenhuma habilidade encontrada.</p>}
    </main>
    <RewardViewer origin={origin} card={selected} favorite={!!selected && favorites.includes(selected.id)} onFavorite={() => selected && toggleFavoriteCard(selected.id)} onClose={() => setSelected(null)} />
    <BottomNav />
  </div>;
}
