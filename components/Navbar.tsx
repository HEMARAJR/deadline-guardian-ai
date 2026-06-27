// ============================================================
// DEADLINE GUARDIAN AI — Top Navbar
// ============================================================
'use client';
import { Bell, Search, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { tasks } = useStore();
  const { user } = useAuth();
  const criticalCount = tasks.filter(t => t.riskLevel === 'critical' || t.riskLevel === 'high').length;

  return (
    <header className="h-16 bg-guardian-surface/80 backdrop-blur border-b border-guardian-border flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1">
        <h1 className="text-white font-bold text-base">{title}</h1>
        {subtitle && <p className="text-guardian-muted text-xs">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium px-3 py-1.5 rounded-full">
            <Zap className="w-3 h-3" />
            {criticalCount} at risk
          </div>
        )}

        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-guardian-muted hover:text-white transition-colors">
          <Search className="w-4 h-4" />
        </button>

        <div className="relative">
          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-guardian-muted hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          {criticalCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
              {criticalCount}
            </span>
          )}
        </div>

        {user?.photoURL && (
          <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border border-guardian-border" />
        )}
      </div>
    </header>
  );
}
