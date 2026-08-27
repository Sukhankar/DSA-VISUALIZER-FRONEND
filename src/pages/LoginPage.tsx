import React from 'react';
import { Card } from '../components/ui/Card';
import { LoginForm } from '../features/auth/components/LoginForm';
import { LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Welcome Back</h1>
            <p className="text-xs text-slate-400">Sign in to your DSA Visualizer account</p>
          </div>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
};
