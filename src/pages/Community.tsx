import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { Users, Trophy, Zap } from 'lucide-react';

export default function Community() {
  const comingSoonItems = [
    { icon: Users, title: 'Seguidores', desc: 'Siga outros jogadores e acompanhe seu progresso.' },
    { icon: Trophy, title: 'Desafios Comunitários', desc: 'Metas coletivas com recompensas exclusivas.' },
    { icon: Zap, title: 'Ranking de Evolução', desc: 'Veja quem mais evoluiu — sem competição tóxica.' },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display text-accent mb-1">Comunidade</h1>
        <p className="text-xs font-body text-muted-foreground">Conecte-se com outros aventureiros</p>
      </div>

      <div className="space-y-4">
        {comingSoonItems.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            className="bg-card rounded-xl border border-border p-5 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3">
              <Icon size={22} className="text-muted-foreground" />
            </div>
            <h3 className="font-display text-sm text-foreground mb-1">{title}</h3>
            <p className="text-xs font-body text-muted-foreground">{desc}</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-secondary text-[10px] font-body text-muted-foreground">
              Em Breve
            </span>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
