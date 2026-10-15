import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/rpg/Ornaments';
import { RpgIcon, RpgIconName } from '@/components/rpg/RpgIcon';

export default function Community() {
  const comingSoonItems: { icon: RpgIconName; title: string; desc: string }[] = [
    { icon: 'shield', title: 'Aliados', desc: 'Siga outros jogadores e acompanhe seu progresso.' },
    { icon: 'trophy', title: 'Missões da Guilda', desc: 'Metas coletivas com recompensas exclusivas.' },
    { icon: 'crown', title: 'Salão da Evolução', desc: 'Veja quem mais evoluiu — sem competição tóxica.' },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 pb-28 pt-8">
      <PageHeader title="Guilda" subtitle="Conecte-se com outros aventureiros" icon="shield" />

      <div className="space-y-4">
        {comingSoonItems.map(({ icon, title, desc }, i) => (
          <motion.div
            key={title}
            className="rpg-frame rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="rune-socket mx-auto mb-3 h-14 w-14 opacity-80">
              <RpgIcon name={icon} size={26} />
            </span>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>
            <p className="mt-1 font-body text-sm text-muted-foreground">{desc}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--gold-deep))] bg-[hsl(var(--gold)/0.08)] px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              <RpgIcon name="lock" size={11} /> Em breve
            </span>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
