import { Button } from '@/components/ui/button';
import { RpgIcon } from './RpgIcon';
import { orbStyle } from './ConstellationUI';
import { getRewardPresentation } from '@/lib/collectionPresentation';
import { ORB_ART } from '@/lib/journeyAssets';
import type { OrbData, SkillCard } from '@/types/game';
import { Lock, Star } from 'lucide-react';

export function SkillWeb({ orb, cards, earnedIds, favorites, onSelect }: {
  orb: OrbData; cards: SkillCard[]; earnedIds: Set<string>; favorites: string[]; onSelect: (card: SkillCard, rect: DOMRect) => void;
}) {
  const height = Math.max(480, Math.ceil(cards.length / 2) * 138 + 165);
  const rootY = height - 80;
  const points = cards.map((card, i) => ({ card, x: i % 2 === 0 ? 58 : 190, y: rootY - 160 - Math.floor(i / 2) * 138 }));
  const earned = cards.filter(card => earnedIds.has(card.id)).length;
  return <section className="skill-tree" style={orbStyle(orb.id)} aria-label={`Habilidades da ${orb.name}`}>
    <div className="skill-tree-heading"><h2>{orb.name}</h2><p>{earned} / {cards.length} despertadas</p></div>
    <div className="skill-tree-map" style={{ height }}>
      <svg className="skill-tree-lines" viewBox={`0 0 248 ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <path className="skill-trunk" d={`M124 ${rootY} C124 ${rootY - 80} 124 100 124 70`} />
        {points.map(({ card, x, y }) => <g key={card.id} className={earnedIds.has(card.id) ? 'is-earned' : 'is-locked'}>
          <path className="skill-branch" d={`M124 ${y + 80} C124 ${y + 35} ${x} ${y + 65} ${x} ${y}`} />
          {earnedIds.has(card.id) && <path className="skill-energy" d={`M124 ${y + 80} C124 ${y + 35} ${x} ${y + 65} ${x} ${y}`} />}
          <circle className="skill-junction" cx="124" cy={y + 80} r="3" />
        </g>)}
      </svg>
      {points.map(({ card, x, y }) => {
        const unlocked = earnedIds.has(card.id);
        const { icon, challenge } = getRewardPresentation(card);
        return <div key={card.id} className={`skill-node ${unlocked ? 'is-earned' : 'is-locked'}`} style={{ left: `${x / 248 * 100}%`, top: y }}>
          <Button variant="ghost" className="skill-node-button" disabled={!unlocked} aria-label={unlocked ? `Inspecionar ${card.name}` : `Habilidade bloqueada: ${card.name}`} title={unlocked ? card.description : `Despertada em: ${challenge?.title || 'Jornada'}`} onClick={event => onSelect(card, event.currentTarget.getBoundingClientRect())}>
            <RpgIcon name={icon} size={27} />
            {!unlocked && <Lock className="skill-lock" />}
            {favorites.includes(card.id) && <Star className="skill-favorite-star" fill="currentColor" />}
          </Button>
          <span className="skill-node-name">{card.name}</span>
          <span className="skill-node-kind">{card.passive ? 'Passiva' : 'Ativa'}</span>
        </div>;
      })}
      <div className="skill-root"><img src={ORB_ART[orb.id]} alt={`Orbe ${orb.name}`} /><span>{orb.focus}</span></div>
    </div>
  </section>;
}