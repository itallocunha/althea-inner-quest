import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { ArchiveHeader, CollectionEmpty, CollectionFilters, CollectionSearch, RewardCard, RewardViewer } from '@/components/rpg/CollectionUI';
import { CHARACTER_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';
import { matchesCollectionSearch } from '@/lib/collectionPresentation';
import type { ItemCard } from '@/types/game';

export default function Inventory() {
  const { state, toggleFavoriteCard } = useGame();
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<ItemCard | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  if (!state.character) return <Navigate to="/" replace />;
  const favorites = state.favoriteCardIds || [];
  const categories = [...new Set(state.itemCards.map(card => card.category))];
  const cards = state.itemCards.filter(card => matchesCollectionSearch(card, query) && (filter === 'Todos' || (filter === 'Favoritos' ? favorites.includes(card.id) : card.category === filter)));
  return <div className="archive-page">
    <ArchiveHeader title="Inventário" eyebrow="O acervo do aventureiro" description="Tesouros que você encontrou. Histórias que só você pode contar." icon="chest" art={CHARACTER_ART.mage}>
      <div className="archive-header-stats"><span><strong>{state.itemCards.length}</strong> itens coletados</span><span><strong>{state.itemCards.filter(card => favorites.includes(card.id)).length}</strong> favoritos</span></div>
    </ArchiveHeader>
    <main className="archive-content">
      <CollectionSearch value={query} onChange={setQuery} placeholder="Buscar um tesouro…" />
      <CollectionFilters options={['Todos', ...categories, 'Favoritos']} value={filter} onChange={setFilter} />
      {state.itemCards.length === 0 ? <CollectionEmpty icon="chest" title="Todo tesouro começa com uma aventura" description="Complete os desafios da sua jornada para descobrir artefatos, equipamentos e relíquias." destination={getJourneyResume(state).destination} /> : cards.length === 0 ? <CollectionEmpty icon="compass" title="Nenhum tesouro por aqui" description="Experimente outra busca ou categoria para explorar seu inventário." /> : <>
        <div className="archive-section-label"><span>Vitrine de tesouros</span><span>{cards.length} {cards.length === 1 ? 'item' : 'itens'}</span></div>
        <div className="relic-grid">{cards.map((card, index) => <RewardCard key={card.id} card={card} index={index} favorite={favorites.includes(card.id)} onSelect={rect => { setOrigin(rect); setSelected(card); }} onFavorite={() => toggleFavoriteCard(card.id)} />)}</div>
        <p className="archive-footnote">Cada artefato é uma memória da sua evolução.</p>
      </>}
    </main>
    <RewardViewer origin={origin} card={selected} favorite={!!selected && favorites.includes(selected.id)} onFavorite={() => selected && toggleFavoriteCard(selected.id)} onClose={() => setSelected(null)} />
    <BottomNav />
  </div>;
}
