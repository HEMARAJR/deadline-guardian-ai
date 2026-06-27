'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Shield, Mic, Key, Moon, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [darkMode] = useState(true);

  const Toggle = ({ value, onChange }: {value:boolean; onChange:(v:boolean)=>void}) => (
    <button onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-guardian-blue' : 'bg-guardian-border'}`}>
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="grid-bg min-h-screen">
      <Navbar title="Settings" subtitle="Configure your AI Chief-of-Staff" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Profile */}
        <div className="bg-guardian-card rounded-xl border border-guardian-border p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-guardian-blue" /> Profile</h3>
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-16 h-16 rounded-full border-2 border-guardian-blue" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-guardian-blue flex items-center justify-center text-white text-2xl font-bold">
                {user?.displayName?.[0] || 'U'}
              </div>
            )}
            <div>
              <p className="text-white font-semibold">{user?.displayName || 'Guardian User'}</p>
              <p className="text-guardian-muted text-sm">{user?.email}</p>
              <p className="text-guardian-blue text-xs mt-1">Google Account Connected</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-guardian-card rounded-xl border border-guardian-border p-6 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2"><Globe className="w-4 h-4 text-guardian-blue" /> Preferences</h3>
          {[
            { icon: Bell, label: 'Push Notifications', desc: 'Get alerts for high-risk deadlines', value: notifications, onChange: setNotifications },
            { icon: Mic, label: 'Voice Commands', desc: 'Enable Web Speech API microphone access', value: voiceEnabled, onChange: setVoiceEnabled },
            { icon: Moon, label: 'Dark Mode', desc: 'Always on — optimized for focus', value: darkMode, onChange: () => {} },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-guardian-border last:border-0">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-guardian-muted" />
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-guardian-muted text-xs">{item.desc}</p>
                </div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        {/* API Configuration */}
        <div className="bg-guardian-card rounded-xl border border-guardian-border p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-guardian-blue" /> API Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="text-guardian-muted text-xs block mb-1">Gemini API Key</label>
              <div className="flex gap-2">
                <input type="password" placeholder="Set in .env.local → GEMINI_API_KEY" readOnly
                  className="flex-1 bg-guardian-bg border border-guardian-border rounded-lg px-4 py-2.5 text-guardian-muted text-sm focus:outline-none" />
              </div>
              <p className="text-guardian-muted text-xs mt-1">Configure in your .env.local file</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-guardian-card rounded-xl border border-guardian-border p-6">
          <h3 className="text-white font-semibold mb-2">About Deadline Guardian AI</h3>
          <p className="text-guardian-muted text-sm">Version 1.0.0 · Hackathon Edition</p>
          <p className="text-guardian-muted text-xs mt-2">Built with Next.js 14, Firebase, Gemini AI & Framer Motion</p>
          <div className="flex gap-2 mt-4 flex-wrap text-xs">
            {['Next.js 14','TypeScript','Firebase','Gemini AI','Framer Motion','Tailwind CSS','Zustand','Recharts'].map(t => (
              <span key={t} className="px-2 py-1 bg-guardian-blue/10 text-guardian-blue rounded border border-guardian-blue/20">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
