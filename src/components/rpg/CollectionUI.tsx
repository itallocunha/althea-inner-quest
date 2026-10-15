import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card3DViewer } from './Card3DViewer';
import { RpgIcon, type RpgIconName } from './RpgIcon';
import { ArtifactSigil } from './ArtifactSigil';
export { ArtifactSigil } from './ArtifactSigil';
import { getRewardPresentation, getRewardProjection } from '@/lib/collectionPresentation';
import type { ItemCard, SkillCard } from '@/types/game';

export function ArchiveHeader({ title, eyebrow, description, icon, art, children }: {
  title: string; eyebrow: string; description: string; icon: RpgIconName; art: string; children?: ReactNode;
}) {
  return <header className="archive-header">
    <img src={art} alt="" className="archive-header-art" />
    <div className="archive-header-shade" />
    <div className="relative z-10 px-6 pb-7 pt-5 sm:px-9">
      <Link to="/collections" className="archive-back"><ArrowLeft size={14} /> Coleções</Link>
      <div className="mb-4 mt-6 flex items-center gap-3">
        <span className="rune-socket h-11 w-11"><RpgIcon name={icon} size={22} /></span>
        <span className="archive-eyebrow">{eyebrow}</span>
      </div>
      <h1 className="font-title text-3xl text-[#f7e6bf] sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-sm font-body text-base leading-relaxed text-[#d0c6dc]">{description}</p>
      {children}
    </div>
  </header>;
}

export function CollectionSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="archive-search">
    <Search size={17} aria-hidden="true" />
    <input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
    <span className="hidden font-display text-[10px] tracking-widest text-muted-foreground sm:block">BUSCAR</span>
  </label>;
}

export function CollectionFilters({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="archive-filters" role="group" aria-label="Filtrar coleção">
    {options.map(option => <button key={option} aria-pressed={value === option} onClick={() => onChange(option)} className={value === option ? 'is-active' : ''}>{option}</button>)}
  </div>;
}

export function RewardCard({ card, index, favorite, onSelect, onFavorite }: {
  card: ItemCard | SkillCard; index: number; favorite: boolean; onSelect: (origin: DOMRect) => void; onFavorite: () => void;
}) {
  const { icon, color, orb } = getRewardPresentation(card);
  const reduced = useReducedMotion();
  const badge = card.type === 'item' ? card.category : card.passive ? 'Passiva' : 'Ativa';
  return <motion.article className="relic-card" style={{ '--relic-color': color } as CSSProperties}
    initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 8) * .045 }}>
    <button className="relic-card-main" onClick={event => onSelect(event.currentTarget.getBoundingClientRect())} aria-label={`Inspecionar ${card.name}`}>
      <div className="relic-card-art">
        <span className="relic-index">{String(index + 1).padStart(2, '0')}</span>
        <ArtifactSigil icon={icon} color={color} />
        <span className="relic-badge">{badge}</span>
      </div>
      <div className="relic-card-info">
        <p className="relic-provenance">{orb?.name || 'Acervo do herói'}</p>
        <h2>{card.name}</h2>
        <p className="relic-description">{card.description}</p>
        <span className="relic-inspect">Inspecionar <ArrowRight size={12} /></span>
      </div>
    </button>
    <button className={`relic-favorite ${favorite ? 'is-favorite' : ''}`} aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${card.name} ${favorite ? 'dos' : 'aos'} favoritos`} aria-pressed={favorite} onClick={onFavorite}>
      <Star size={15} fill={favorite ? 'currentColor' : 'none'} />
    </button>
  </motion.article>;
}

export function RewardViewer({ card, origin, favorite, onFavorite, onClose }: {
  card: ItemCard | SkillCard | null; origin?: DOMRect | null; favorite: boolean; onFavorite: () => void; onClose: () => void;
}) {
  return <Card3DViewer origin={origin} onClose={onClose} card={card ? {
    ...getRewardProjection(card),
    footer: <button className="archive-secondary" onClick={onFavorite} aria-pressed={favorite}><Star size={15} fill={favorite ? 'currentColor' : 'none'} />{favorite ? 'Nos seus favoritos' : 'Guardar nos favoritos'}</button>,
  } : null} />;
}
export function CollectionEmpty({ icon, title, description, destination, action = 'Continuar jornada' }: {
  icon: RpgIconName; title: string; description: string; destination?: string; action?: string;
}) {
  return <div className="archive-empty">
    <ArtifactSigil icon={icon} />
    <h2 className="font-display text-lg text-[#f3dfb8]">{title}</h2>
    <p className="mx-auto mt-3 max-w-xs font-body text-base leading-relaxed text-muted-foreground">{description}</p>
    {destination && <Link to={destination} className="archive-primary mt-6">{action}<ArrowRight size={15} /></Link>}
  </div>;
}
