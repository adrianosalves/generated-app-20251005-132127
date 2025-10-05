import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  Users,
  LayoutDashboard,
  BarChart3,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Painel' },
  { to: '/vacancies', icon: Briefcase, label: 'Vagas' },
  { to: '/candidates', icon: Users, label: 'Candidatos' },
  { to: '/analytics', icon: BarChart3, label: 'Análises' },
];
const NavItem = ({ to, icon: Icon, label }: (typeof navItems)[0]) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        'flex items-center gap-4 px-4 py-3 text-sidebar-foreground/80 rounded-lg transition-all duration-200 ease-in-out',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105',
        isActive && 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:text-primary-foreground',
      )
    }
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </NavLink>
);
export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r bg-card text-card-foreground md:flex">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Target className="h-6 w-6 text-primary" />
            <span className="text-xl font-display">COSTUMA Talentos</span>
          </NavLink>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <p className="text-center text-xs text-muted-foreground">
            Construído com ❤��� na Cloudflare
          </p>
        </div>
      </div>
    </div>
  );
}