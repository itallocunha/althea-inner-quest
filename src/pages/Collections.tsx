import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sword, Shield, Scroll, BookOpen, ChevronRight } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';

export default function Collections() {
  const navigate = useNavigate();
  const { state } = useGame();

  if (!state.character) { navigate('/'); return null; }

  const sections = [
    {
      label: 'Inventário',
      description: 'Itens e artefatos coletados nas jornadas',
      count: state.itemCards.length,
      emoji: '🎒',
      Icon: Sword,
      to: '/inventory',
      gradient: 'from-[hsl(210_80%_55%/0.15)] to-transparent',
      accent: 'text-[hsl(210_80%_55%)]',
    },
    {
      label: 'Coleção de Medalhas',
      description: 'Conquistas e honrarias desbloqueadas',
      count: state.unlockedMedals.length,
      emoji: '🏅',
      Icon: Shield,
      to: '/medals',
      gradient: 'from-[hsl(45_100%_65%/0.15)] to-transparent',
      accent: 'text-accent',
    },
    {
      label: 'Grimório de Habilidades',
      description: 'Cartas de habilidades e poderes adquiridos',
      count: state.skillCards.length,
      emoji: '📖',
      Icon: Scroll,
      to: '/grimoire',
      gradient: 'from-[hsl(270_60%_50%/0.15)] to-transparent',
      accent: 'text-[hsl(270_60%_50%)]',
    },
    {
      label: 'Histórias do Personagem',
      description: 'Crônicas e narrativas da sua jornada',
      count: (state.stories || []).length,
      emoji: '📚',
      Icon: BookOpen,
      to: '/stories',
      gradient: 'from-[hsl(140_60%_45%/0.15)] to-transparent',
      accent: 'text-[hsl(140_60%_45%)]',
    },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-xl font-display text-accent mb-1">Coleções</h1>
      <p className="text-xs font-body text-muted-foreground mb-6">Todos os seus tesouros e conquistas</p>

      <div className="space-y-3">
        {sections.map(({ label, description, count, emoji, Icon, to, gradient, accent }, i) => (
          <motion.button
            key={to}
            onClick={() => navigate(to)}
            className="w-full rounded-2xl border border-border bg-card overflow-hidden text-left"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`relative p-4 bg-gradient-to-r ${gradient}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
                  <span className="text-2xl">{emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm text-foreground">{label}</h3>
                  <p className="text-[10px] font-body text-muted-foreground mt-0.5">{description}</p>
                  <p className={`text-[11px] font-body font-semibold mt-1 ${accent}`}>
                    {count} {count === 1 ? 'item' : 'itens'}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
