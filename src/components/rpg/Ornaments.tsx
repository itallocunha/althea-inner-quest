import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RpgIcon, RpgIconName } from './RpgIcon';

/** Gold rule with a diamond in the middle. */
export function OrnateDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[hsl(var(--gold)/0.8)]" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[hsl(var(--gold))] shadow-[0_0_8px_hsl(var(--gold))]" />
      <span className="h-2.5 w-2.5 rotate-45 border border-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.15)]" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[hsl(var(--gold))] shadow-[0_0_8px_hsl(var(--gold))]" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[hsl(var(--gold)/0.8)]" />
    </div>
  );
}

/** Left-aligned section heading with a gold rune and a fading rule. */
export function SectionTitle({ children, icon }: { children: ReactNode; icon?: RpgIconName }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      {icon ? <RpgIcon name={icon} size={17} className="text-[hsl(var(--gold))]" /> : <span className="h-2 w-2 rotate-45 bg-[hsl(var(--gold))]" />}
      <h2 className="text-gold font-display text-sm font-bold uppercase tracking-[0.16em]">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[hsl(var(--gold)/0.6)] to-transparent" />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: RpgIconName;
  children?: ReactNode;
}

/** Centered page title in molten gold with an ornate divider. */
export function PageHeader({ title, subtitle, icon, children }: PageHeaderProps) {
  return (
    <header className="mb-6 text-center">
      {icon && (
        <motion.div
          className="rune-socket mx-auto mb-3 h-12 w-12"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        >
          <RpgIcon name={icon} size={24} />
        </motion.div>
      )}
      <h1 className="text-gold font-title text-2xl font-bold leading-tight">{title}</h1>
      {subtitle && <p className="mx-auto mt-1 max-w-xs font-body text-sm text-muted-foreground">{subtitle}</p>}
      <OrnateDivider className="mt-3" />
      {children}
    </header>
  );
}

/** Hexagonal level badge, optionally wrapped around a portrait. */
export function LevelMedallion({ level, src, alt = '', size = 56 }: { level: number; src?: string; alt?: string; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#fff2a8,#d9911c,#8a5410,#f7d35a,#fff2a8)] p-[3px] shadow-[0_0_18px_hsl(var(--accent)/0.4)]">
        <div className="h-full w-full overflow-hidden rounded-full border-2 border-[hsl(266_50%_8%)] bg-[hsl(266_50%_10%)]">
          {src && <img src={src} alt={alt} className="h-full w-full object-cover object-top" />}
        </div>
      </div>
      <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-md border border-[#fff2a8]/80 bg-gradient-to-b from-[#f9d15a] to-[#c9780f] px-1 font-display text-[11px] font-bold text-[hsl(266_50%_10%)] shadow-md [clip-path:none]">
        {level}
      </span>
    </div>
  );
}

interface XpMeterProps {
  percent: number;
  label?: string;
  value?: string;
  className?: string;
}

/** Engraved XP track with molten fill. */
export function XpMeter({ percent, label, value, className = '' }: XpMeterProps) {
  return (
    <div className={`w-full ${className}`}>
      {(label || value) && (
        <div className="mb-1 flex items-center justify-between">
          <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
          <span className="font-display text-[11px] font-bold text-accent">{value}</span>
        </div>
      )}
      <div className="xp-track">
        <motion.div
          className="xp-fill"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
