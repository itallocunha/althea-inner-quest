import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { ArchiveHeader, CollectionEmpty, CollectionFilters, CollectionSearch, RewardCard, RewardViewer } from '@/components/rpg/CollectionUI';
import { CHARACTER_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';
import { matchesCollectionSearch } from '@/lib/collectionPresentation';
import { RpgIcon } from '@/components/rpg/RpgIcon';
import type { SkillCard } from '@/types/game';

export default function Grimoire() {
  const { state, toggleFavoriteCard } = useGame();
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<SkillCard | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todas');
  if (!state.character) return <Navigate to="/" replace />;
  const favorites = state.favoriteCardIds || [];
  const cards = state.skillCards.filter(card => matchesCollectionSearch(card, query) && (filter === 'Todas' || (filter === 'Favoritas' ? favorites.includes(card.id) : filter === 'Passivas' ? card.passive : !card.passive)));
  const passiveCount = state.skillCards.filter(card => card.passive).length;
  return <div className="archive-page grimoire-page">
    <ArchiveHeader title="Grimório" eyebrow="A magia que existe em você" description="Cada descoberta desperta um novo poder. Abra as páginas da sua evolução." icon="tome" art={CHARACTER_ART.channeling}>
      <div className="archive-header-stats"><span><strong>{state.skillCards.length}</strong> habilidades</span><span><strong>{passiveCount}</strong> passivas</span><span><strong>{state.skillCards.length - passiveCount}</strong> ativas</span></div>
    </ArchiveHeader>
    <main className="archive-content">
      <div className="grimoire-note"><RpgIcon name="spark" size={24} /><p><strong>Conhecimento é o seu poder.</strong><br />Passivas representam qualidades constantes. Ativas são recursos para colocar em prática.</p></div>
      <CollectionSearch value={query} onChange={setQuery} placeholder="Buscar uma habilidade…" />
      <CollectionFilters options={['Todas', 'Passivas', 'Ativas', 'Favoritas']} value={filter} onChange={setFilter} />
      {state.skillCards.length === 0 ? <CollectionEmpty icon="tome" title="Sua primeira página espera por você" description="Ao completar desafios, novas habilidades serão inscritas neste grimório. A sua magia está apenas começando." destination={getJourneyResume(state).destination} /> : cards.length === 0 ? <CollectionEmpty icon="eye" title="Este capítulo ainda está vazio" description="Escolha outro filtro ou procure uma habilidade pelo nome." /> : <>
        <div className="archive-section-label"><span>Selos de conhecimento</span><span>{cards.length} {cards.length === 1 ? 'habilidade' : 'habilidades'}</span></div>
        <div className="relic-grid">{cards.map((card, index) => <RewardCard key={card.id} card={card} index={index} favorite={favorites.includes(card.id)} onSelect={rect => { setOrigin(rect); setSelected(card); }} onFavorite={() => toggleFavoriteCard(card.id)} />)}</div>
        <p className="archive-footnote">Inspecione um selo para conhecer sua essência e origem.</p>
      </>}
    </main>
    <RewardViewer origin={origin} card={selected} favorite={!!selected && favorites.includes(selected.id)} onFavorite={() => selected && toggleFavoriteCard(selected.id)} onClose={() => setSelected(null)} />
    <BottomNav />
  </div>;
}
