import { motion, useReducedMotion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { OrnateDivider } from '@/components/rpg/Ornaments';
import { ArtifactSigil, RewardCard, RewardViewer } from '@/components/rpg/CollectionUI';
import { RpgIcon, type RpgIconName } from '@/components/rpg/RpgIcon';
import { CHARACTER_ART, ORB_CONTINENT_ART, ORB_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';
import type { ItemCard, SkillCard } from '@/types/game';

export default function Collections() {
  const { state, toggleFavoriteCard } = useGame();
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<ItemCard | SkillCard | null>(null);
  const reduced = useReducedMotion();
  if (!state.character) return <Navigate to="/" replace />;
  const favorites = state.favoriteCardIds || [];
  const total = state.itemCards.length + state.skillCards.length + state.unlockedMedals.length + (state.stories || []).length;
  const sections: { label: string; eyebrow: string; description: string; count: number; unit: string; icon: RpgIconName; to: string; art: string; color: string }[] = [
    { label: 'Inventário', eyebrow: 'Relíquias & artefatos', description: 'Cada tesouro guarda uma parte de quem você se tornou.', count: state.itemCards.length, unit: 'itens coletados', icon: 'chest', to: '/inventory', art: CHARACTER_ART.mage, color: '195 65% 65%' },
    { label: 'Grimório de Habilidades', eyebrow: 'Magia & conhecimento', description: 'Os poderes que despertaram ao longo do caminho.', count: state.skillCards.length, unit: 'habilidades', icon: 'tome', to: '/grimoire', art: CHARACTER_ART.channeling, color: '275 65% 73%' },
    { label: 'Salão de Medalhas', eyebrow: 'Glória & conquistas', description: 'Honrarias que eternizam a coragem de seguir em frente.', count: state.unlockedMedals.length, unit: 'medalhas', icon: 'medal', to: '/medals', art: ORB_CONTINENT_ART.yellow, color: '43 92% 64%' },
    { label: 'Crônicas do Personagem', eyebrow: 'Memórias & lendas', description: 'A história que só o seu herói poderia escrever.', count: (state.stories || []).length, unit: 'crônicas', icon: 'quill', to: '/stories', art: ORB_CONTINENT_ART.green, color: '160 48% 63%' },
  ];
  const latest = [...state.itemCards.slice(-2), ...state.skillCards.slice(-2)];
  return <div className="archive-page collections-page">
    <header className="collections-heading">
      <p className="archive-eyebrow">Althea · Acervo pessoal</p>
      <div className="collections-orbs" aria-hidden="true">{(['green', 'blue', 'yellow', 'purple', 'red'] as const).map((orb, index) => <img key={orb} src={ORB_ART[orb]} alt="" style={{ transform: `translateY(${Math.abs(index - 2) * 10}px)` }} />)}</div>
      <h1 className="font-title text-3xl text-[#f3dfb8] sm:text-4xl">Coleções</h1>
      <p className="mx-auto mt-3 max-w-md font-body text-base leading-relaxed text-muted-foreground">A aventura passa. Os tesouros, os poderes e as histórias ficam.</p>
      <OrnateDivider className="mt-5" />
      <p className="mt-5 font-body text-sm text-muted-foreground"><span className="text-[#f3dfb8]">{total} registros</span> de uma jornada que é só sua</p>
    </header>
    <main className="archive-content">
      <div className="collection-portals">{sections.map((section, index) => <motion.div key={section.to} initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .07 }}>
        <Link to={section.to} className="collection-portal" style={{ '--relic-color': section.color } as CSSProperties}>
          <img src={section.art} alt="" className="portal-art" loading="lazy" />
          <div className="portal-shade" />
          <div className="portal-content">
            <div className="flex items-center gap-3"><span className="portal-icon"><RpgIcon name={section.icon} size={24} /></span><span className="archive-eyebrow">{section.eyebrow}</span></div>
            <h2 className="mt-6 max-w-[80%] font-display text-xl leading-snug text-[#f5e5c7]">{section.label}</h2>
            <p className="mt-2 max-w-[75%] font-body text-sm leading-relaxed text-[#c7bdd1]">{section.description}</p>
            <div className="portal-footer"><span><strong>{String(section.count).padStart(2, '0')}</strong> {section.count === 1 ? ({ 'itens coletados': 'item coletado', habilidades: 'habilidade', medalhas: 'medalha', crônicas: 'crônica' }[section.unit]) : section.unit}</span><span className="portal-enter">Explorar <ArrowRight size={16} /></span></div>
          </div>
        </Link>
      </motion.div>)}</div>
      <div className="archive-section-label mt-9"><span>Marcas da sua aventura</span><RpgIcon name="spark" size={17} /></div>
      {latest.length ? <div className="relic-grid">{latest.map((card, index) => <RewardCard key={card.id} card={card} index={index} favorite={favorites.includes(card.id)} onSelect={rect => { setOrigin(rect); setSelected(card); }} onFavorite={() => toggleFavoriteCard(card.id)} />)}</div> : <div className="collection-invitation"><ArtifactSigil icon="compass" /><div><h2 className="font-display text-lg text-[#f3dfb8]">A sua lenda está começando</h2><p className="mt-2 font-body text-base text-muted-foreground">Os primeiros tesouros esperam por você nos desafios de Althea.</p><Link className="archive-primary mt-4" to={getJourneyResume(state).destination}>Continuar aventura <ArrowRight size={15} /></Link></div></div>}
    </main>
    <RewardViewer origin={origin} card={selected} favorite={!!selected && favorites.includes(selected.id)} onFavorite={() => selected && toggleFavoriteCard(selected.id)} onClose={() => setSelected(null)} />
    <BottomNav />
  </div>;
}
