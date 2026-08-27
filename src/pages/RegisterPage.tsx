import React from 'react';
import { Card } from '../components/ui/Card';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Create Account</h1>
            <p className="text-xs text-slate-400">Join CodeLoom DSA to start visual learning</p>
          </div>
        </div>

        <RegisterForm />
      </Card>
    </div>
  );
};
