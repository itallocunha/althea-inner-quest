import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { ATTRIBUTE_LABELS, AttributeKey, RACE_LABELS, CLASS_LABELS, RACE_ICONS, CLASS_ICONS, xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';
import { XPBar } from '@/components/XPBar';
import { BottomNav } from '@/components/BottomNav';
import { Plus, RotateCcw } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { state, distributePoints, resetGame } = useGame();

  if (!state.character) {
    navigate('/');
    return null;
  }

  const c = state.character;

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-4xl mb-2 glow-primary">
          {RACE_ICONS[c.race]}
        </div>
        <h1 className="text-2xl font-display text-accent">{c.name}</h1>
        <p className="text-sm text-muted-foreground font-body">
          {RACE_LABELS[c.race]} • {CLASS_LABELS[c.characterClass]} {CLASS_ICONS[c.characterClass]}
        </p>
        <p className="text-xs text-muted-foreground font-body">Idade: {c.age}</p>
      </div>

      <div className="mb-6">
        <XPBar />
      </div>

      {c.freePoints > 0 && (
        <div className="bg-accent/10 rounded-xl border border-accent/30 p-3 mb-4 text-center">
          <p className="text-sm font-body text-accent font-semibold">{c.freePoints} pontos livres para distribuir!</p>
        </div>
      )}

      {/* Attributes */}
      <h2 className="font-display text-accent text-sm mb-3">Atributos</h2>
      <div className="space-y-2 mb-6">
        {(Object.keys(c.attributes) as AttributeKey[]).map(key => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs font-body text-muted-foreground flex-1 truncate">{ATTRIBUTE_LABELS[key]}</span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(c.attributes[key] / 10) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-body text-accent w-5 text-right">{c.attributes[key]}</span>
            {c.freePoints > 0 && c.attributes[key] < 10 && (
              <button onClick={() => distributePoints(key, 1)} className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                <Plus size={10} className="text-accent" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-display text-accent">{state.unlockedMedals.length}</p>
          <p className="text-[10px] font-body text-muted-foreground">Medalhas</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-display text-accent">{state.itemCards.length}</p>
          <p className="text-[10px] font-body text-muted-foreground">Itens</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-display text-accent">{state.skillCards.length}</p>
          <p className="text-[10px] font-body text-muted-foreground">Habilidades</p>
        </div>
      </div>

      <button
        onClick={() => { if (confirm('Resetar todo o progresso?')) resetGame(); }}
        className="w-full py-2 rounded-full border border-destructive/30 text-destructive text-sm font-body flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} /> Resetar Jogo
      </button>

      <BottomNav />
    </div>
  );
}
