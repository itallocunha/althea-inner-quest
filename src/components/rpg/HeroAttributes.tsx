import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Plus, Sparkles, Check } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CORE_ATTRIBUTE_META, ADVANCED_ATTRIBUTE_META, ATTRIBUTE_MAX, type CoreAttributeKey, type AdvancedAttributeKey } from '@/types/game';
import { ATTRIBUTE_ICONS } from '@/lib/attributeIcons';
import './HeroAttributes.css';

const GROUPS: { name: string; caption: string; keys: CoreAttributeKey[] }[] = [
  { name: 'Essência', caption: 'Conhecer e imaginar', keys: ['selfKnowledge', 'intelligence', 'creativity', 'focus', 'problemSolving'] },
  { name: 'Vontade', caption: 'Sustentar e transformar', keys: ['physicalStrength', 'emotionalStrength', 'resilience', 'determination', 'selfManagement'] },
  { name: 'Conexão', caption: 'Encontrar e compartilhar', keys: ['empathy', 'communication', 'teamwork', 'leadership', 'adaptability'] },
];
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
const X = [47, 63, 35, 60, 43];
const Y = [9, 29, 49, 69, 89];

export function HeroAttributes() {
  const { state, distributePoints } = useGame();
  const [selected, setSelected] = useState<CoreAttributeKey>('selfKnowledge');
  const [activeGroup, setActiveGroup] = useState(0);
  const [feedback, setFeedback] = useState('');
  const nodes = useRef<Partial<Record<CoreAttributeKey, HTMLButtonElement | null>>>({});
  const character = state.character;
  if (!character) return null;
  const meta = CORE_ATTRIBUTE_META[selected];
  const Icon = ATTRIBUTE_ICONS[selected];
  const value = character.attributes[selected] || 0;
  const canAdd = character.freePoints >= 1 && value < ATTRIBUTE_MAX;

  function selectAttribute(key: CoreAttributeKey, groupIndex: number) {
    setSelected(key);
    setActiveGroup(groupIndex);
    setFeedback('');
  }

  function navigateConstellation(event: KeyboardEvent<HTMLButtonElement>, groupIndex: number, index: number) {
    let nextGroup = groupIndex;
    let nextIndex = index;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % 5;
    else if (event.key === 'ArrowUp') nextIndex = (index + 4) % 5;
    else if (event.key === 'ArrowRight') nextGroup = (groupIndex + 1) % GROUPS.length;
    else if (event.key === 'ArrowLeft') nextGroup = (groupIndex + GROUPS.length - 1) % GROUPS.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = 4;
    else return;
    event.preventDefault();
    const key = GROUPS[nextGroup].keys[nextIndex];
    selectAttribute(key, nextGroup);
    requestAnimationFrame(() => nodes.current[key]?.focus());
  }

  return <div className="hero-starfolio">
    <header className="starfolio-heading">
      <div><p className="starfolio-kicker">O céu que existe em você</p><h2>Constelação de atributos</h2><p>Escolha uma estrela. Conheça sua força. Decida onde crescer.</p></div>
      <div className="starfolio-points"><Sparkles size={20} aria-hidden="true" /><strong>{character.freePoints}</strong><span>pontos livres</span></div>
    </header>
    <div className="starfolio-mobile-groups" aria-label="Ramos da constelação">
      {GROUPS.map((group, index) => <button key={group.name} type="button" aria-pressed={activeGroup === index} onClick={() => selectAttribute(group.keys[0], index)}>{group.name}</button>)}
    </div>
    <div className="starfolio-sky" aria-label="Quinze atributos em três constelações">
      <div className="starfolio-sky-grain" aria-hidden="true" />
      {GROUPS.map((group, groupIndex) => <section key={group.name} className={`starfolio-branch ${activeGroup === groupIndex ? 'is-active-branch' : ''}`} aria-label={`Constelação ${group.name}`}>
        <header><span>0{groupIndex + 1}</span><h3>{group.name}</h3><p>{group.caption}</p></header>
        <div className="starfolio-map">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={X.map((x, i) => `${x},${Y[i]}`).join(' ')} /></svg>
          {group.keys.map((key, index) => {
            const attribute = CORE_ATTRIBUTE_META[key];
            const Rune = ATTRIBUTE_ICONS[key];
            const val = character.attributes[key] || 0;
            return <button ref={node => { nodes.current[key] = node; }} type="button" key={key}
              className={`starfolio-node ${selected === key ? 'is-selected' : ''}`}
              style={{ left: `${X[index]}%`, top: `${Y[index]}%`, '--star-color': attribute.color } as CSSProperties}
              aria-label={`Explorar ${attribute.label}: ${val} de ${ATTRIBUTE_MAX}`}
              aria-pressed={selected === key} aria-controls="hero-selected-attribute"
              tabIndex={selected === key ? 0 : -1}
              onKeyDown={event => navigateConstellation(event, groupIndex, index)}
              onClick={() => selectAttribute(key, groupIndex)}>
              <span className="starfolio-rune"><Rune size={20} aria-hidden="true" /></span>
              <span className="starfolio-node-text">{attribute.label}<strong>{val}<small> / {ATTRIBUTE_MAX}</small></strong></span>
            </button>;
          })}
        </div>
      </section>)}
    </div>
    <p className="starfolio-instruction"><span aria-hidden="true">✦</span> Toque em uma estrela para explorar. No teclado, use as setas entre as estrelas.</p>
    <section className="starfolio-detail" id="hero-selected-attribute" aria-label="Atributo selecionado" style={{ '--star-color': meta.color } as CSSProperties}>
      <div className="starfolio-selected-icon"><Icon size={29} aria-hidden="true" /></div>
      <div className="starfolio-description" aria-live="polite"><p className="starfolio-kicker">Sua próxima escolha</p><h3>{meta.label} <span>{value}<small> / {ATTRIBUTE_MAX}</small></span></h3><p>{DESCRIPTIONS[selected]}</p><div className="starfolio-meter" aria-hidden="true"><span style={{ transform: `scaleX(${value / ATTRIBUTE_MAX})` }} /></div></div>
      <div className="starfolio-evolve"><button type="button" disabled={!canAdd} onClick={() => {
        if (!canAdd) return;
        distributePoints(selected, 1);
        setFeedback(`${meta.label} recebeu 1 ponto. ${character.freePoints - 1} pontos livres restantes.`);
      }} aria-label={`Aumentar ${meta.label} em 1 ponto`}><Plus size={17} aria-hidden="true" /> Evoluir +1</button>
        <p>{value >= ATTRIBUTE_MAX ? 'Esta estrela atingiu seu máximo.' : character.freePoints < 1 ? 'Ganhe pontos ao subir de nível.' : 'Usa 1 ponto livre. Escolha com intenção.'}</p>
      </div>
      <p className="starfolio-feedback" role="status">{feedback && <><Check size={14} aria-hidden="true" />{feedback}</>}</p>
    </section>
    <details className="starfolio-future"><summary><Sparkles size={17} aria-hidden="true" /><span>Estrelas de jornadas futuras</span><small>12 em descoberta</small></summary>
      <p>Um vislumbre de outras jornadas. Estes atributos estão disponíveis apenas para consulta nesta página.</p>
      <div>{(Object.keys(ADVANCED_ATTRIBUTE_META) as AdvancedAttributeKey[]).map(key => {
        const attribute = ADVANCED_ATTRIBUTE_META[key];
        const Rune = ATTRIBUTE_ICONS[key];
        return <article key={key}><Rune size={17} aria-hidden="true" /><span>{attribute.label}<small>{attribute.journey}</small></span><strong>{character.attributes[key] || 0}<small> / {ATTRIBUTE_MAX}</small></strong></article>;
      })}</div>
    </details>
  </div>;
}
