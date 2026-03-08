import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { CardDetailModal } from '@/components/CardDetailModal';
import { useNavigate } from 'react-router-dom';
import { ItemCard } from '@/types/game';

const ITEM_ART: Record<string, string> = {
  '🖼️': 'linear-gradient(135deg, hsl(270 50% 45%), hsl(210 60% 50%))',
  '🛡️': 'linear-gradient(135deg, hsl(210 70% 45%), hsl(200 80% 35%))',
  '🗺️': 'linear-gradient(135deg, hsl(35 70% 45%), hsl(25 60% 35%))',
  '🌳': 'linear-gradient(135deg, hsl(140 60% 40%), hsl(120 50% 30%))',
  '⏳': 'linear-gradient(135deg, hsl(45 80% 50%), hsl(35 70% 35%))',
  '🔮': 'linear-gradient(135deg, hsl(280 60% 50%), hsl(260 50% 35%))',
  '📜': 'linear-gradient(135deg, hsl(40 50% 45%), hsl(30 40% 30%))',
  '🏆': 'linear-gradient(135deg, hsl(45 100% 55%), hsl(35 90% 40%))',
  '⚔️': 'linear-gradient(135deg, hsl(0 60% 45%), hsl(350 50% 30%))',
  '🎯': 'linear-gradient(135deg, hsl(0 70% 50%), hsl(15 60% 35%))',
  '🧭': 'linear-gradient(135deg, hsl(200 50% 45%), hsl(180 40% 30%))',
  '💎': 'linear-gradient(135deg, hsl(190 70% 50%), hsl(200 80% 35%))',
};

function getItemGradient(icon: string) {
  return ITEM_ART[icon] || 'linear-gradient(135deg, hsl(270 40% 40%), hsl(250 30% 25%))';
}

const CATEGORY_COLORS: Record<string, string> = {
  'Artefato': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Equipamento': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Relíquia': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Ferramenta': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Documento': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] || 'bg-accent/20 text-accent border-accent/30';
}

export default function Inventory() {
  const navigate = useNavigate();
  const { state } = useGame();
  const [selected, setSelected] = useState<ItemCard | null>(null);

  if (!state.character) { navigate('/'); return null; }

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-display text-accent mb-1">Inventário</h1>
      <p className="text-xs text-muted-foreground font-body mb-6">{state.itemCards.length} itens coletados</p>

      {state.itemCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl">🎒</span>
          </div>
          <p className="text-muted-foreground font-body text-sm">Nenhum item ainda.</p>
          <p className="text-xs text-muted-foreground font-body">Complete desafios para receber cartas!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {state.itemCards.map((card, i) => (
            <motion.div
              key={card.id}
              className="relative rounded-2xl overflow-hidden border-2 border-border shadow-lg group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(card)}
            >
              <div className="h-28 flex items-center justify-center relative" style={{ background: getItemGradient(card.icon) }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                <span className="text-5xl drop-shadow-lg relative z-10">{card.icon}</span>
              </div>
              <div className="bg-card p-3 relative">
                <div className="absolute -top-3 left-2">
                  <span className={`text-[8px] font-display px-2 py-0.5 rounded-full border ${getCategoryStyle(card.category)}`}>
                    {card.category}
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
        type="item"
        data={selected ? {
          icon: selected.icon,
          name: selected.name,
          description: selected.description,
          category: selected.category,
          gradient: getItemGradient(selected.icon),
        } : null}
      />

      <BottomNav />
    </div>
  );
}
