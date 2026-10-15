import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ORBS } from '@/data/gameData';
import { ORB_ART } from '@/lib/journeyAssets';
import type { OrbId } from '@/types/game';

export const orbStyle = (orb: OrbId) => ({ '--branch-color': `var(--orb-${orb})` } as CSSProperties);

export function ConstellationAtmosphere({ animated }: { animated: boolean }) {
  return <div className="constellation-atmosphere" aria-hidden="true" data-animated={animated}>
    <div className="constellation-stardust" />
    {Array.from({ length: 32 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 11) % 100}%`, '--drift-duration': `${12 + i % 9}s`, '--drift-delay': `${-i * 1.7}s` } as CSSProperties} />)}
  </div>;
}

export function ConstellationHeader({ title, eyebrow, count, animated, onToggle, children }: {
  title: string; eyebrow: string; count: string; animated: boolean; onToggle: () => void; children?: ReactNode;
}) {
  return <header className="constellation-header">
    <div className="constellation-topline">
      <Button asChild variant="ghost" size="sm"><Link to="/collections"><ArrowLeft /> Coleções</Link></Button>
      <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Alternar animações" aria-pressed={animated} title={animated ? 'Pausar animações' : 'Ativar animações'}><Sparkles /></Button>
    </div>
    <p className="constellation-eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    <p className="constellation-count">{count}</p>
    {children}
  </header>;
}

export function OrbSelector({ selected, onSelect }: { selected: OrbId | null; onSelect: (orb: OrbId | null) => void }) {
  return <div className="constellation-orb-selector" role="group" aria-label="Filtrar por Orbe">
    <Button variant="ghost" className="constellation-all" aria-pressed={selected === null} onClick={() => onSelect(null)}>Todas as Orbes</Button>
    {ORBS.map(orb => <Button key={orb.id} variant="ghost" className="constellation-orb-tab" style={orbStyle(orb.id)} aria-label={orb.name} aria-pressed={selected === orb.id} title={orb.name} onClick={() => onSelect(selected === orb.id ? null : orb.id)}>
      <img src={ORB_ART[orb.id]} alt="" /><span>{orb.name.split(' ')[0]}</span>
    </Button>)}
  </div>;
}