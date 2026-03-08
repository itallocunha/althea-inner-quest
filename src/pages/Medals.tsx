import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { CardDetailModal } from '@/components/CardDetailModal';
import { ALL_CHALLENGES } from '@/data/gameData';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const ORB_MEDAL_COLORS: Record<string, { gradient: string; gradientCSS: string; glow: string; border: string; label: string }> = {
  blue: { gradient: 'from-blue-400 via-blue-500 to-blue-700', gradientCSS: 'linear-gradient(135deg, hsl(210 80% 55%), hsl(220 70% 40%))', glow: 'shadow-blue-500/40', border: 'border-blue-400/40', label: 'Azul' },
  green: { gradient: 'from-emerald-400 via-emerald-500 to-emerald-700', gradientCSS: 'linear-gradient(135deg, hsl(140 60% 45%), hsl(150 50% 30%))', glow: 'shadow-emerald-500/40', border: 'border-emerald-400/40', label: 'Verde' },
  purple: { gradient: 'from-purple-400 via-purple-500 to-purple-700', gradientCSS: 'linear-gradient(135deg, hsl(270 60% 50%), hsl(280 50% 35%))', glow: 'shadow-purple-500/40', border: 'border-purple-400/40', label: 'Roxa' },
  red: { gradient: 'from-red-400 via-rose-500 to-red-700', gradientCSS: 'linear-gradient(135deg, hsl(0 70% 55%), hsl(350 60% 35%))', glow: 'shadow-red-500/40', border: 'border-red-400/40', label: 'Vermelha' },
  yellow: { gradient: 'from-yellow-300 via-amber-400 to-amber-600', gradientCSS: 'linear-gradient(135deg, hsl(45 100% 65%), hsl(35 90% 40%))', glow: 'shadow-amber-500/40', border: 'border-amber-400/40', label: 'Amarela' },
};

const MEDAL_ICONS = ['🏅', '⭐', '🎖️', '🏆', '💫', '✨', '🌟', '🔱', '👑', '💎'];

interface MedalData {
  name: string;
  orbId: string;
  challenge: string;
  xp: number;
  index: number;
  icon: string;
}

export default function Medals() {
  const navigate = useNavigate();
  const { state } = useGame();
  const [selected, setSelected] = useState<MedalData | null>(null);

  if (!state.character) { navigate('/'); return null; }

  const allMedalData: MedalData[] = ALL_CHALLENGES.map(c => ({
    name: c.medalName,
    orbId: c.orbId,
    challenge: c.title,
    xp: c.xpReward,
    index: c.index,
    icon: MEDAL_ICONS[c.index % MEDAL_ICONS.length],
  }));
  const unlocked = new Set(state.unlockedMedals);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-display text-accent mb-1">Coleção de Medalhas</h1>
      <p className="text-xs text-muted-foreground font-body mb-6">{unlocked.size}/{allMedalData.length} desbloqueadas</p>

      <div className="mb-6">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.size / allMedalData.length) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {allMedalData.map((medal, i) => {
          const isUnlocked = unlocked.has(medal.name);
          const colors = ORB_MEDAL_COLORS[medal.orbId] || ORB_MEDAL_COLORS.blue;

          return (
            <motion.div
              key={i}
              className={`relative rounded-2xl overflow-hidden cursor-pointer ${
                isUnlocked ? `border-2 ${colors.border} shadow-lg ${colors.glow}` : 'border border-border'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
              whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
              onClick={() => isUnlocked && setSelected(medal)}
            >
              {isUnlocked ? (
                <>
                  <div className={`h-24 bg-gradient-to-br ${colors.gradient} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.2),transparent_60%)]" />
                    <motion.span
                      className="text-4xl drop-shadow-lg relative z-10"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                    >
                      {medal.icon}
                    </motion.span>
                  </div>
                  <div className="bg-card p-3">
                    <h3 className="font-display text-[11px] text-accent leading-tight">{medal.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-body mt-1 line-clamp-1">{medal.challenge}</p>
                    <div className="mt-2 pt-1.5 border-t border-border flex items-center justify-between">
                      <span className="text-[8px] font-body text-accent">+{medal.xp} XP</span>
                      <span className="text-[8px] font-body text-muted-foreground uppercase tracking-wider">{colors.label}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full bg-card/50 flex flex-col items-center justify-center py-8 px-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                  <span className="text-[9px] font-body text-muted-foreground leading-tight">{medal.name}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <CardDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        type="medal"
        data={selected ? {
          icon: selected.icon,
          name: selected.name,
          challengeName: selected.challenge,
          xp: selected.xp,
          orbLabel: ORB_MEDAL_COLORS[selected.orbId]?.label || '',
          gradient: ORB_MEDAL_COLORS[selected.orbId]?.gradientCSS || '',
        } : null}
      />

      <BottomNav />
    </div>
  );
}
