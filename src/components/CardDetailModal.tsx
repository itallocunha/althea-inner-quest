import { Card3DViewer } from '@/components/rpg/Card3DViewer';
import type { OrbId } from '@/types/game';

interface CardDetailModalProps {
  open: boolean;
  onClose: () => void;
  origin?: DOMRect | null;
  type: 'item' | 'skill' | 'medal';
  data: {
    icon: string;
    image?: string;
    name: string;
    description?: string;
    category?: string;
    passive?: boolean;
    gradient?: string;
    xp?: number;
    orbId?: OrbId;
    orbLabel?: string;
    challengeName?: string;
  } | null;
}

export function CardDetailModal({ open, onClose, origin, type, data }: CardDetailModalProps) {
  return <Card3DViewer onClose={onClose} origin={origin} card={open && data ? {
    name: data.name,
    image: data.image,
    icon: data.icon,
    description: data.description,
    gradient: data.gradient,
    color: data.orbId ? `var(--orb-${data.orbId})` : '43 92% 64%',
    orbId: data.orbId,
    badge: type === 'medal' ? `Medalha${data.orbLabel ? ` · Orbe ${data.orbLabel}` : ''}` : type === 'skill' ? data.passive ? 'Passiva' : 'Ativa' : data.category || 'Artefato',
    backTitle: data.challengeName || data.name,
    backDescription: type === 'medal'
      ? `Conquistada no desafio ${data.challengeName || data.name}.${data.xp ? ` Uma conquista de ${data.xp} XP na sua jornada.` : ''}`
      : data.description,
  } : null} />;
}
