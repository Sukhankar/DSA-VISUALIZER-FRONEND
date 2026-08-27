import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="p-4 bg-slate-900 rounded-full border border-slate-800 text-indigo-400">
        <FileQuestion className="w-12 h-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white">404 — Page Not Found</h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          The requested route does not exist or has been moved.
        </p>
      </div>
      <Link to="/">
        <Button leftIcon={<Home className="w-4 h-4" />}>
          Return to Home Page
        </Button>
      </Link>
    </div>
  );
};
