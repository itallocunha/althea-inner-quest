import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function Inventory() {
  const navigate = useNavigate();
  const { state } = useGame();

  if (!state.character) { navigate('/'); return null; }

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-display text-accent mb-4">Inventário</h1>

      {state.itemCards.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl block mb-3">🎒</span>
          <p className="text-muted-foreground font-body text-sm">Nenhum item ainda. Complete desafios para receber cartas!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {state.itemCards.map((card, i) => (
            <motion.div
              key={card.id}
              className="bg-card rounded-xl border border-border p-4 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-3xl block mb-2">{card.icon}</span>
              <h3 className="font-display text-sm text-accent">{card.name}</h3>
              <p className="text-[10px] text-muted-foreground font-body mt-1">{card.description}</p>
              <span className="text-[9px] text-primary font-body mt-1 block">{card.category}</span>
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
