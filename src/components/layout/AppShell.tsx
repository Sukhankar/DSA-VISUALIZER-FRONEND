import React from 'react';
import { TopStatusBar } from './TopStatusBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col min-h-screen text-slate-100 selection:bg-indigo-500 selection:text-white"
      style={{
        backgroundColor: '#070B16',
        backgroundImage: `
          radial-gradient(ellipse at 20% 10%, rgba(124,108,255,0.07) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(232,121,249,0.05) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 90%, rgba(56,189,248,0.04) 0%, transparent 50%)
        `,
      }}
    >
      <TopStatusBar />
      <Navbar />
      <main className="flex-grow w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {children}
      </main>

      <Footer />
    </div>
  );
};
