import React from 'react';
import { Card } from '../components/ui/Card';
import { ShieldAlert } from 'lucide-react';

export const AdminPage: React.FC = () => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Admin Control Panel</h1>
          <p className="text-xs text-slate-400">Manage categories, algorithms, and system resources. Restricted to ROLE_ADMIN users.</p>
        </div>
      </div>

      <Card className="text-center py-16">
        <p className="text-sm text-slate-300 font-medium">Admin Management Interface</p>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
          Category CRUD, algorithm creation/editing modals, and deletion workflows will be active in Phase 9F.
        </p>
      </Card>
    </div>
  );
};
