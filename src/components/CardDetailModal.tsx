import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ItemCard, SkillCard } from '@/types/game';

interface CardDetailModalProps {
  open: boolean;
  onClose: () => void;
  type: 'item' | 'skill' | 'medal';
  data: {
    icon: string;
    name: string;
    description?: string;
    category?: string;
    passive?: boolean;
    gradient?: string;
    xp?: number;
    orbLabel?: string;
    challengeName?: string;
  } | null;
}

export function CardDetailModal({ open, onClose, type, data }: CardDetailModalProps) {
  if (!data) return null;

  const bgGradient = data.gradient || 'linear-gradient(135deg, hsl(270 50% 45%), hsl(210 60% 50%))';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-xs rounded-3xl overflow-hidden border-2 border-accent/30 shadow-2xl"
            initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotateY: -90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ perspective: '800px' }}
          >
            {/* Art section */}
            <div
              className="h-48 flex items-center justify-center relative"
              style={{ background: bgGradient }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.15),transparent_60%)]" />
              
              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
                  style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
                  animate={{ y: [-5, 5, -5], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}

              <motion.span
                className="text-7xl drop-shadow-2xl relative z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {data.icon}
              </motion.span>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-20"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Info section */}
            <div className="bg-card p-5 space-y-3">
              {/* Type badge */}
              {type === 'item' && data.category && (
                <span className="inline-block text-[10px] font-display px-3 py-1 rounded-full border bg-accent/10 border-accent/30 text-accent">
                  {data.category}
                </span>
              )}
              {type === 'skill' && (
                <span className={`inline-block text-[10px] font-display px-3 py-1 rounded-full border ${
                  data.passive
                    ? 'bg-primary/20 border-primary/40 text-primary-foreground'
                    : 'bg-accent/20 border-accent/40 text-accent'
                }`}>
                  {data.passive ? '⭐ Passiva' : '⚡ Ativa'}
                </span>
              )}
              {type === 'medal' && data.orbLabel && (
                <span className="inline-block text-[10px] font-display px-3 py-1 rounded-full border bg-accent/10 border-accent/30 text-accent">
                  Orbe {data.orbLabel}
                </span>
              )}

              <h2 className="font-display text-lg text-accent leading-tight">{data.name}</h2>

              {data.description && (
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{data.description}</p>
              )}

              {type === 'medal' && (
                <div className="space-y-1.5">
                  {data.challengeName && (
                    <p className="text-xs font-body text-muted-foreground">
                      <span className="text-accent">Desafio:</span> {data.challengeName}
                    </p>
                  )}
                  {data.xp && (
                    <p className="text-xs font-body text-accent">+{data.xp} XP</p>
                  )}
                </div>
              )}

              {/* Decorative footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[9px] font-body text-muted-foreground uppercase tracking-widest">
                  {type === 'item' ? 'Item Colecionável' : type === 'skill' ? 'Carta de Habilidade' : 'Medalha'}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(s => (
                    <motion.div
                      key={s}
                      className="w-1.5 h-1.5 rounded-full bg-accent/50"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: s * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
