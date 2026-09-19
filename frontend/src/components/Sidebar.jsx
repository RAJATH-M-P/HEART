import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, History } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Report', path: '/upload', icon: FileUp },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="glass-card-static p-4 sticky top-28">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500/20 text-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
