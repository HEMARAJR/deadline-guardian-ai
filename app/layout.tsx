// ============================================================
// DEADLINE GUARDIAN AI — Root Layout
// ============================================================
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deadline Guardian AI — Predict missed deadlines before they happen',
  description: 'Your AI Chief-of-Staff that predicts deadline risks, simulates futures, and generates emergency rescue plans.',
  keywords: ['AI', 'productivity', 'deadline', 'task management', 'chief of staff'],
  openGraph: {
    title: 'Deadline Guardian AI',
    description: 'Predict missed deadlines before they happen.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-guardian-bg antialiased">
        {children}
      </body>
    </html>
  );
}
