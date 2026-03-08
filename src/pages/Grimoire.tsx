import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { CardDetailModal } from '@/components/CardDetailModal';
import { useNavigate } from 'react-router-dom';
import { SkillCard } from '@/types/game';

const SKILL_ART: Record<string, string> = {
  '💡': 'radial-gradient(circle at 30% 30%, hsl(45 100% 70%), hsl(45 80% 40%))',
  '✍️': 'radial-gradient(circle at 30% 30%, hsl(210 60% 60%), hsl(270 50% 35%))',
  '🛡️': 'radial-gradient(circle at 30% 30%, hsl(200 70% 55%), hsl(210 80% 30%))',
  '👁️': 'radial-gradient(circle at 30% 30%, hsl(270 70% 60%), hsl(300 50% 30%))',
  '🕸️': 'radial-gradient(circle at 30% 30%, hsl(140 50% 50%), hsl(160 60% 25%))',
  '🌟': 'radial-gradient(circle at 30% 30%, hsl(45 100% 65%), hsl(30 90% 40%))',
  '👑': 'radial-gradient(circle at 30% 30%, hsl(45 90% 60%), hsl(35 80% 30%))',
  '🔥': 'radial-gradient(circle at 30% 30%, hsl(15 90% 55%), hsl(0 70% 30%))',
  '⚡': 'radial-gradient(circle at 30% 30%, hsl(50 100% 60%), hsl(40 90% 35%))',
  '🌊': 'radial-gradient(circle at 30% 30%, hsl(200 80% 55%), hsl(220 70% 30%))',
  '🔮': 'radial-gradient(circle at 30% 30%, hsl(280 60% 55%), hsl(260 50% 30%))',
  '🪽': 'radial-gradient(circle at 30% 30%, hsl(0 70% 55%), hsl(350 60% 30%))',
};

function getCardGradient(icon: string) {
  return SKILL_ART[icon] || 'radial-gradient(circle at 30% 30%, hsl(270 50% 50%), hsl(270 40% 25%))';
}

export default function Grimoire() {
  const navigate = useNavigate();
  const { state } = useGame();
  const [selected, setSelected] = useState<SkillCard | null>(null);

  if (!state.character) { navigate('/'); return null; }

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-display text-accent mb-1">Grimório de Habilidades</h1>
      <p className="text-xs text-muted-foreground font-body mb-6">{state.skillCards.length} habilidades desbloqueadas</p>

      {state.skillCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl">📖</span>
          </div>
          <p className="text-muted-foreground font-body text-sm">Nenhuma habilidade ainda.</p>
          <p className="text-xs text-muted-foreground font-body">Complete desafios para aprender!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {state.skillCards.map((card, i) => (
            <motion.div
              key={card.id}
              className="relative rounded-2xl overflow-hidden border-2 border-accent/20 shadow-lg group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(card)}
            >
              <div className="h-32 flex items-center justify-center relative" style={{ background: getCardGradient(card.icon) }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 border border-accent/30 rounded-t-2xl" />
                <span className="text-5xl drop-shadow-lg relative z-10">{card.icon}</span>
              </div>
              <div className="bg-card p-3 relative">
                <div className="absolute -top-3 right-2">
                  <span className={`text-[9px] font-display px-2 py-0.5 rounded-full border ${
                    card.passive ? 'bg-primary/30 border-primary/40 text-primary-foreground' : 'bg-accent/30 border-accent/40 text-accent'
                  }`}>
                    {card.passive ? '⭐ Passiva' : '⚡ Ativa'}
                  </span>
                </div>
                <h3 className="font-display text-xs text-accent mt-1 leading-tight">{card.name}</h3>
                <p className="text-[9px] text-muted-foreground font-body mt-1.5 leading-relaxed line-clamp-2">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CardDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        type="skill"
        data={selected ? {
          icon: selected.icon,
          name: selected.name,
          description: selected.description,
          passive: selected.passive,
          gradient: getCardGradient(selected.icon),
        } : null}
      />

      <BottomNav />
    </div>
  );
}
