// ============================================================
// DEADLINE GUARDIAN AI — Dashboard Layout (protected)
// ============================================================
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Small delay to let auth state load
    const timer = setTimeout(() => {
      if (user === null) {
        // Check if auth is still loading vs actually logged out
        const authLoaded = localStorage.getItem('auth-checked');
        if (authLoaded === 'true') router.push('/');
      } else if (user) {
        localStorage.setItem('auth-checked', 'true');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="flex min-h-screen bg-guardian-bg">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
