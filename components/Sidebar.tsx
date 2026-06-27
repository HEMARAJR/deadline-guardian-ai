// ============================================================
// DEADLINE GUARDIAN AI — Sidebar
// ============================================================
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Mic, Zap, AlertTriangle, BarChart3,
  Settings, Shield, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/command-center', icon: Mic, label: 'AI Command' },
  { href: '/simulator', icon: Zap, label: 'Simulator' },
  { href: '/rescue', icon: AlertTriangle, label: 'Rescue' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-guardian-surface border-r border-guardian-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-guardian-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-guardian-blue flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wider">DEADLINE</div>
            <div className="text-guardian-blue text-xs font-mono tracking-widest">GUARDIAN AI</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  active
                    ? 'bg-guardian-blue/20 text-white border border-guardian-blue/40'
                    : 'text-guardian-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${active ? 'text-guardian-blue' : ''}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto text-guardian-blue" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-guardian-border">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-guardian-blue flex items-center justify-center text-white text-sm font-bold">
                {user.displayName?.[0] || user.email?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user.displayName || 'Guardian User'}
              </p>
              <p className="text-guardian-muted text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-guardian-muted hover:text-white hover:bg-white/5 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
