import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-card-static sticky top-0 z-50 flex items-center justify-between px-6 py-4 mb-8">
      <Link to="/" className="flex items-center gap-3 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
          <HeartPulse size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AR Medical<span className="text-cyan-400">Viz</span></h1>
          <p className="text-xs text-slate-400">Cardiac Analysis System</p>
        </div>
      </Link>

      {user && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <User size={16} className="text-cyan-400" />
            <span>{user.fullName}</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
