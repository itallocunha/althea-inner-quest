import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RpgIcon, RpgIconName } from '@/components/rpg/RpgIcon';

const navItems: { to: string; icon: RpgIconName; label: string }[] = [
  { to: '/', icon: 'castle', label: 'Casa' },
  { to: '/world', icon: 'map', label: 'Mundo' },
  { to: '/journeys', icon: 'sword', label: 'Jornadas' },
  { to: '/collections', icon: 'chest', label: 'Coleções' },
  { to: '/community', icon: 'shield', label: 'Guilda' },
  { to: '/profile', icon: 'helm', label: 'Herói' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[hsl(var(--gold-deep)/0.8)] bg-[linear-gradient(180deg,hsl(268_42%_14%/0.97),hsl(266_50%_7%/0.99))] shadow-[0_-12px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
      <div className="mx-auto flex h-[4.5rem] max-w-lg items-end justify-around px-1 box-content pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
        {navItems.map(({ to, icon, label }) => {
          const active = location.pathname === to
            || (to === '/collections' && ['/inventory', '/grimoire', '/medals', '/stories'].includes(location.pathname))
            || (to === '/journeys' && (location.pathname === '/orbs' || location.pathname.startsWith('/orb/') || location.pathname.startsWith('/challenge/')));
          return (
            <NavLink key={to} to={to} aria-label={label} aria-current={active ? 'page' : undefined} className="group relative flex min-h-14 w-14 flex-col items-center gap-0.5 pt-1">
              <span className="relative flex h-10 w-10 items-center justify-center">
                {active && (
                  <motion.span
                    layoutId="nav-gem"
                    className="absolute inset-0 rotate-45 rounded-lg border border-[hsl(var(--gold))] bg-gradient-to-br from-[hsl(var(--gold)/0.35)] to-[hsl(var(--gold-deep)/0.2)] shadow-[0_0_18px_hsl(var(--gold)/0.6)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <RpgIcon
                  name={icon}
                  size={22}
                  className={`relative transition-all duration-200 ${active ? 'text-[hsl(var(--gold))] drop-shadow-[0_0_6px_hsl(var(--gold))] -translate-y-px' : 'text-muted-foreground group-hover:text-foreground'}`}
                />
              </span>
              <span className={`font-display text-[8.5px] font-bold uppercase tracking-[0.08em] ${active ? 'text-accent' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
