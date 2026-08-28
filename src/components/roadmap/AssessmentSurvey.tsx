import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapService } from '../../api/roadmapService';
import { RoadmapTier, AssessmentResultDto } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Zap,
  Code2,
  Compass,
  Trophy,
} from 'lucide-react';

export const AssessmentSurvey: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState<RoadmapTier>('BEGINNER');
  const [preferredLanguage, setPreferredLanguage] = useState('Java');
  const [knowsArrays, setKnowsArrays] = useState(false);
  const [knowsSorting, setKnowsSorting] = useState(false);
  const [knowsTrees, setKnowsTrees] = useState(false);
  const [solvedProblemsBefore, setSolvedProblemsBefore] = useState(false);
  const [goal, setGoal] = useState('Master LeetCode & Coding Interviews');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResultDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await roadmapService.submitAssessment({
        experienceLevel,
        preferredLanguage,
        knowsArrays,
        knowsSorting,
        knowsTrees,
        solvedProblemsBefore,
        goal,
      });
      setResult(res);
      setCurrentStep(5);
    } catch (err: any) {
      console.error('Assessment submission failed:', err);
      setError(err?.response?.data?.message || 'Failed to process assessment survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Progress Dots */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Beginner Placement Survey
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  stepNum === currentStep
                    ? 'bg-indigo-400 w-6'
                    : stepNum < currentStep
                    ? 'bg-emerald-400'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Experience Level */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">What is your current coding background?</h2>
            <p className="text-xs text-slate-400">Select the option that best describes your DSA knowledge.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                tier: 'BEGINNER' as RoadmapTier,
                title: 'Absolute Beginner',
                desc: 'I know basic syntax, but haven’t studied Data Structures or Algorithms before.',
              },
              {
                tier: 'INTERMEDIATE' as RoadmapTier,
                title: 'Intermediate Developer',
                desc: 'I know Arrays, Sorting, and Searching, but want to master Trees and Graphs.',
              },
              {
                tier: 'ADVANCED' as RoadmapTier,
                title: 'Advanced Practitioner',
                desc: 'I am practicing Dynamic Programming, Graphs, and preparing for Top-Tier Interviews.',
              },
            ].map((option) => (
              <div
                key={option.tier}
                onClick={() => setExperienceLevel(option.tier)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  experienceLevel === option.tier
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-lg shadow-indigo-950/20 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{option.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{option.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    experienceLevel === option.tier
                      ? 'border-indigo-400 bg-indigo-500 text-white'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {experienceLevel === option.tier && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preferred Language */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Which language do you prefer?</h2>
            <p className="text-xs text-slate-400">We will tailor code solutions and practice templates for you.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Java', 'Python', 'JavaScript', 'C++'].map((lang) => (
              <div
                key={lang}
                onClick={() => setPreferredLanguage(lang)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  preferredLanguage === lang
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-lg ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-sm font-bold">{lang}</span>
                <Code2 className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Checkbox Knowledge */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Which topics have you practiced before?</h2>
            <p className="text-xs text-slate-400">Check all that apply to refine your starting node.</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'I know Arrays & Two-Pointer techniques', state: knowsArrays, setter: setKnowsArrays },
              { label: 'I know Bubble, Merge, Quick, or Binary Search', state: knowsSorting, setter: setKnowsSorting },
              { label: 'I know Binary Trees & BST Traversals', state: knowsTrees, setter: setKnowsTrees },
              { label: 'I have solved LeetCode problems before', state: solvedProblemsBefore, setter: setSolvedProblemsBefore },
            ].map((chk, i) => (
              <div
                key={i}
                onClick={() => chk.setter(!chk.state)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  chk.state
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold">{chk.label}</span>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    chk.state ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {chk.state && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Learning Goal */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">What is your primary learning goal?</h2>
            <p className="text-xs text-slate-400">Tell us what you wish to achieve with CodeLoom DSA.</p>
          </div>

          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Master LeetCode Mediums & Land Software Engineer Role"
          />

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Path...</span>
                </>
              ) : (
                <>
                  <span>Complete Survey (+50 XP)</span>
                  <Zap className="w-4 h-4 fill-slate-950" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Outcome & Recommendation Banner */}
      {currentStep === 5 && result && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
              <Zap className="w-4 h-4 fill-amber-400" /> +{result.bonusXpEarned} XP Bonus Awarded!
            </div>
            <h2 className="text-3xl font-black text-white">Assessment Complete!</h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">{result.summaryMessage}</p>
          </div>

          <div className="p-6 bg-slate-950 rounded-2xl border border-indigo-500/30 text-left space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recommended Starting Module</div>
            <div className="text-xl font-extrabold text-indigo-400">{result.recommendedModuleTitle}</div>
          </div>

          <button
            onClick={() => navigate(`/roadmap/topics/${result.recommendedModuleSlug}`)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-indigo-600/30"
          >
            <span>Start Recommended Topic Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
