import { NavLink, useLocation } from 'react-router-dom';
import { Home, Gamepad2, BookMarked, Users, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/journeys', icon: Gamepad2, label: 'Jornadas' },
  { to: '/collections', icon: BookMarked, label: 'Coleções' },
  { to: '/community', icon: Users, label: 'Comunidade' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
            >
              <Icon
                size={20}
                className={active ? 'text-accent' : 'text-muted-foreground'}
              />
              <span className={`text-[10px] font-body ${active ? 'text-accent' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
