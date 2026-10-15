import { useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CORE_ATTRIBUTE_META, ADVANCED_ATTRIBUTE_META, ATTRIBUTE_MAX, type CoreAttributeKey, type AdvancedAttributeKey } from '@/types/game';
import { ATTRIBUTE_ICONS } from '@/lib/attributeIcons';
import { RpgIcon } from './RpgIcon';

const CONSTELLATION: CoreAttributeKey[] = ['selfKnowledge', 'intelligence', 'determination', 'resilience', 'empathy', 'creativity'];
const DESCRIPTIONS: Record<CoreAttributeKey, string> = {
  intelligence: 'Conecte ideias, descubra possibilidades e aprenda com cada experiência.',
  physicalStrength: 'Cultive a energia e a disposição para agir no mundo.',
  emotionalStrength: 'Acolha suas emoções e encontre firmeza para seguir em frente.',
  resilience: 'Transforme dificuldades em aprendizado e encontre novos caminhos.',
  selfKnowledge: 'Reconheça seus valores, seus limites e o potencial que existe em você.',
  communication: 'Dê voz às suas ideias e construa pontes com outras pessoas.',
  teamwork: 'Some forças, compartilhe descobertas e cresça com seus aliados.',
  focus: 'Direcione sua atenção ao que faz sentido para a sua jornada.',
  creativity: 'Imagine possibilidades e dê forma a ideias que ainda não existem.',
  determination: 'Mantenha o propósito vivo e avance um passo de cada vez.',
  leadership: 'Inspire pessoas e assuma responsabilidade pelas suas escolhas.',
  selfManagement: 'Organize seu tempo, sua energia e os próximos passos da aventura.',
  empathy: 'Escute outras perspectivas e reconheça o que as pessoas sentem.',
  problemSolving: 'Explore alternativas e transforme desafios em soluções.',
  adaptability: 'Ajuste a rota quando o mundo mudar e aprenda com o inesperado.',
};

const point = (index: number, radius: number) => {
  const angle = (index * 60 - 90) * Math.PI / 180;
  return { x: 150 + Math.cos(angle) * radius, y: 150 + Math.sin(angle) * radius };
};
const polygon = (radii: number[]) => radii.map((radius, index) => { const p = point(index, radius); return `${p.x},${p.y}`; }).join(' ');

export function HeroAttributes() {
  const { state, distributePoints } = useGame();
  const [selected, setSelected] = useState<CoreAttributeKey>('selfKnowledge');
  const reduced = useReducedMotion();
  const character = state.character;
  if (!character) return null;
  const meta = CORE_ATTRIBUTE_META[selected];
  const Icon = ATTRIBUTE_ICONS[selected];
  const value = character.attributes[selected] || 0;
  const canAdd = character.freePoints >= 1 && value < ATTRIBUTE_MAX;
  return <>
    <section className="hero-constellation-panel">
      <div className="archive-section-label"><span>Constelação de atributos</span><RpgIcon name="spark" size={17} /></div>
      <p className="text-center font-body text-sm text-muted-foreground">Toque nas runas e descubra as forças do seu herói.</p>
      <div className="hero-constellation">
        <svg viewBox="0 0 300 300" className="constellation-chart" aria-hidden="true">
          <circle cx="150" cy="150" r="119" fill="none" stroke="#d2b575" strokeOpacity=".15" strokeDasharray="2 9" />
          {[.25, .5, .75, 1].map(scale => <polygon key={scale} points={polygon(Array(6).fill(88 * scale))} fill="none" stroke="#bb9cdd" strokeOpacity=".15" />)}
          {CONSTELLATION.map((key, index) => { const p = point(index, 98); return <path key={key} d={`M150 150L${p.x} ${p.y}`} stroke="#bb9cdd" strokeOpacity=".16" />; })}
          <motion.polygon points={polygon(CONSTELLATION.map(key => ((character.attributes[key] || 0) / ATTRIBUTE_MAX) * 88))} fill="rgba(193,157,241,.22)" stroke="#c9a9ef" strokeWidth="1.5" />
          <circle cx="150" cy="150" r="3" fill="#efcf8d" />
        </svg>
        {CONSTELLATION.map((key, index) => {
          const p = point(index, 118);
          const Rune = ATTRIBUTE_ICONS[key];
          return <button key={key} className={`constellation-rune ${selected === key ? 'is-selected' : ''}`} style={{ left: `${p.x / 3}%`, top: `${p.y / 3}%`, '--relic-color': CORE_ATTRIBUTE_META[key].color } as CSSProperties} aria-label={`Explorar ${CORE_ATTRIBUTE_META[key].label}: ${character.attributes[key] || 0} de ${ATTRIBUTE_MAX}`} aria-pressed={selected === key} onClick={() => setSelected(key)}><Rune size={18} /><span>{CORE_ATTRIBUTE_META[key].label}</span></button>;
        })}
      </div>
      <div className="hero-attribute-detail" aria-live="polite" style={{ '--relic-color': meta.color } as CSSProperties}>
        <span className="portal-icon"><Icon size={23} /></span><div className="min-w-0 flex-1"><h3 className="font-display text-sm text-[#f3dfb8]">{meta.label} <span className="font-body text-muted-foreground">{value}/{ATTRIBUTE_MAX}</span></h3><p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{DESCRIPTIONS[selected]}</p></div>
      </div>
      <div className="hero-points"><span><strong>{character.freePoints}</strong> pontos disponíveis</span><button className="archive-secondary" disabled={!canAdd} onClick={() => distributePoints(selected, 1)} aria-label={`Aumentar ${meta.label} em 1 ponto`}><Plus size={14} /> Evoluir +1</button></div>
    </section>
    <section className="mt-7">
      <div className="archive-section-label"><span>Todos os atributos</span><span>Máximo {ATTRIBUTE_MAX}</span></div>
      <div className="hero-attribute-grid">{(Object.keys(CORE_ATTRIBUTE_META) as CoreAttributeKey[]).map(key => {
        const attribute = CORE_ATTRIBUTE_META[key];
        const Rune = ATTRIBUTE_ICONS[key];
        const val = character.attributes[key] || 0;
        return <div key={key} className={`hero-attribute-row ${selected === key ? 'is-selected' : ''}`} style={{ '--relic-color': attribute.color } as CSSProperties}>
          <button className="attribute-select" onClick={() => setSelected(key)} aria-pressed={selected === key}><Rune size={17} /><span>{attribute.label}</span><strong>{val}</strong></button>
          <div className="attribute-track"><motion.div initial={reduced ? false : { width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: .5 }} /></div>
          <button className="attribute-add" disabled={character.freePoints < 1 || val >= ATTRIBUTE_MAX} onClick={() => distributePoints(key, 1)} aria-label={`Adicionar 1 ponto a ${attribute.label}`}><Plus size={14} /></button>
        </div>;
      })}</div>
    </section>
    <details className="hero-advanced mt-6"><summary><RpgIcon name="crown" size={18} /> Atributos de jornadas futuras <span>12</span></summary>
      <p className="px-4 pb-4 font-body text-sm text-muted-foreground">Novas aventuras desenvolvem outras facetas do seu herói.</p>
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">{(Object.keys(ADVANCED_ATTRIBUTE_META) as AdvancedAttributeKey[]).map(key => {
        const attribute = ADVANCED_ATTRIBUTE_META[key];
        const Rune = ATTRIBUTE_ICONS[key];
        const val = character.attributes[key] || 0;
        return <div className="advanced-attribute" key={key}><div className="flex items-center gap-2"><Rune size={14} /><span>{attribute.label}</span></div><p className="mt-2 text-muted-foreground">{val}/{ATTRIBUTE_MAX} · {attribute.journey}</p></div>;
      })}</div>
    </details>
  </>;
}
