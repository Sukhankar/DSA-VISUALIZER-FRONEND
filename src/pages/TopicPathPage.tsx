import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roadmapService } from '../api/roadmapService';
import { RoadmapModuleDto } from '../types';
import { RoadmapStepViewer } from '../components/roadmap/RoadmapStepViewer';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const TopicPathPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [module, setModule] = useState<RoadmapModuleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModuleDetails = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await roadmapService.getModuleDetails(slug);
      setModule(data);
    } catch (err: any) {
      console.error('Failed to load topic path:', err);
      setError(err?.response?.data?.message || 'Failed to load topic learning path');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModuleDetails();
  }, [slug]);

  return (
    <div className="space-y-6">
      {/* Navigation back button */}
      <Link to="/roadmap" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Roadmap</span>
      </Link>

      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Loading topic steps...</p>
        </div>
      ) : error || !module ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center font-bold">
          {error || 'Topic path not found'}
        </div>
      ) : (
        <RoadmapStepViewer module={module} />
      )}
    </div>
  );
};
