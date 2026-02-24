import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function Grimoire() {
  const navigate = useNavigate();
  const { state } = useGame();

  if (!state.character) { navigate('/'); return null; }

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-display text-accent mb-4">Grimório</h1>

      {state.skillCards.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl block mb-3">📖</span>
          <p className="text-muted-foreground font-body text-sm">Nenhuma habilidade ainda. Complete desafios para aprender!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.skillCards.map((card, i) => (
            <motion.div
              key={card.id}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-3xl">{card.icon}</span>
              <div className="flex-1">
                <h3 className="font-display text-sm text-accent">{card.name}</h3>
                <p className="text-xs text-muted-foreground font-body">{card.description}</p>
              </div>
              <span className={`text-[10px] font-body px-2 py-0.5 rounded-full ${card.passive ? 'bg-primary/20 text-primary-foreground' : 'bg-accent/20 text-accent'}`}>
                {card.passive ? 'Passiva' : 'Ativa'}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
