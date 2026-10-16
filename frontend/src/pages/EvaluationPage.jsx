import React, { useState, useEffect } from 'react';
import { 
  Download, BarChart3, CheckCircle2, XCircle, ShieldCheck, 
  Sun, Moon, Award, Activity, RefreshCw, FileSpreadsheet, Filter 
} from 'lucide-react';
import { INITIAL_EVALUATION_DATA } from '../data/constants';

export default function EvaluationPage() {
  const [summary, setSummary] = useState(INITIAL_EVALUATION_DATA);
  const [trials, setTrials] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch summary and trials from backend if available
  const fetchEvaluationData = async () => {
    setIsLoading(true);
    try {
      const [sumRes, trialRes] = await Promise.all([
        fetch('http://localhost:8000/api/evaluation/summary'),
        fetch('http://localhost:8000/api/evaluation/trials')
      ]);

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        if (sumData.total_trials) {
          setSummary(sumData);
        }
      }

      if (trialRes.ok) {
        const trialData = await trialRes.json();
        setTrials(trialData);
      }
    } catch {
      // Backend offline, fallback to preloaded benchmark dataset
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluationData();
  }, []);

  // Download CSV
  const handleDownloadCsv = () => {
    window.open('http://localhost:8000/api/evaluation/export-csv', '_blank');
  };

  // Filtered trials list
  const filteredTrials = trials.filter(t => {
    if (statusFilter === 'CORRECT') return t.Is_Correct;
    if (statusFilter === 'INCORRECT') return !t.Is_Correct;
    return true;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>EMPIRICAL BENCHMARK EVALUATION REPORT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Model Performance Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Quantitative evaluation metrics across 10 gesture classes tested under varied lighting conditions, webcam resolutions, and latency constraints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchEvaluationData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl glass-card text-slate-300 hover:text-white border border-slate-800 text-sm font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh Metrics</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-bold text-sm shadow-glow-emerald transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Evaluation CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Overall Accuracy */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Overall Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-black text-emerald-400 font-mono tracking-tight">
            {summary.overall_accuracy}%
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {summary.correct_predictions} correct / {summary.total_trials} total trials
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full" 
              style={{ width: `${summary.overall_accuracy}%` }} 
            />
          </div>
        </div>

        {/* Total Recorded Tests */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Total Recorded Trials</span>
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-black text-white font-mono tracking-tight">
            {summary.total_trials}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            10 trials per model gesture class
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full w-full" />
          </div>
        </div>

        {/* Average Confidence */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Mean Confidence</span>
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-black text-cyan-300 font-mono tracking-tight">
            {(summary.average_confidence * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-400 mt-2">
            High certainty threshold (&gt;0.85)
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full" 
              style={{ width: `${summary.average_confidence * 100}%` }} 
            />
          </div>
        </div>

        {/* Average Inference Latency */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Average Latency</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-4xl font-black text-blue-300 font-mono tracking-tight">
            {summary.average_latency_ms} ms
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Equivalent to ~31 FPS throughput
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full w-4/5" />
          </div>
        </div>

      </div>

      {/* Per-Gesture Breakdown Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Per-Gesture Class Evaluation
            </h3>
            <p className="text-xs text-slate-400">
              Disaggregated accuracy, error rates, and mean confidence for all 10 signs.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            10 Classes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Gesture Label</th>
                <th className="py-3 px-4">Total Trials</th>
                <th className="py-3 px-4">Correct</th>
                <th className="py-3 px-4">Incorrect</th>
                <th className="py-3 px-4">Accuracy Bar</th>
                <th className="py-3 px-4 text-right">Accuracy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {summary.per_gesture.map((g) => (
                <tr key={g.gesture} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{g.gesture}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{g.total_tests}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">{g.correct}</td>
                  <td className="py-3.5 px-4 font-mono text-rose-400">{g.incorrect}</td>
                  <td className="py-3.5 px-4 w-48">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          g.accuracy >= 95 ? 'bg-emerald-400' : g.accuracy >= 85 ? 'bg-cyan-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${g.accuracy}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                    {g.accuracy}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Robustness Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summary.lighting_breakdown.map((env) => {
          const isStudio = env.condition.includes('Studio');
          const isDaylight = env.condition.includes('Daylight');
          return (
            <div 
              key={env.condition}
              className="glass-card p-6 rounded-3xl border border-slate-800/90 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Lighting Condition
                </span>
                {isStudio ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : isDaylight ? (
                  <Sun className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Moon className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <h4 className="text-base font-bold text-white">
                {env.condition}
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan-300 font-mono">
                  {env.accuracy}%
                </span>
                <span className="text-xs text-slate-400">
                  ({env.correct} / {env.total} trials)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full" 
                  style={{ width: `${env.accuracy}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {isStudio 
                  ? 'Optimal condition: High contrast skin segmentation with zero shadow interference.'
                  : isDaylight 
                  ? 'Realistic condition: Natural daylight on standard laptop webcams.'
                  : 'Challenging condition: Grainy sensor noise; 6-frame stability prevents false triggers.'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Recorded Trials Table */}
      {trials.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                Recorded Test Trials Log
              </h3>
              <p className="text-xs text-slate-400">
                Individual trial records stored in the evaluation database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                {['ALL', 'CORRECT', 'INCORRECT'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      statusFilter === filter 
                        ? 'bg-cyan-600 text-white shadow-glow-cyan' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="uppercase bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Trial ID</th>
                  <th className="py-2.5 px-3">Intended</th>
                  <th className="py-2.5 px-3">Predicted</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Lighting / Environment</th>
                  <th className="py-2.5 px-3">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredTrials.slice(0, 50).map((t) => (
                  <tr key={t.Trial_ID} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-cyan-400 font-bold">{t.Trial_ID}</td>
                    <td className="py-2 px-3 text-white font-sans">{t.Intended_Gesture}</td>
                    <td className="py-2 px-3 font-sans">{t.Predicted_Gesture}</td>
                    <td className="py-2 px-3">{(t.Confidence * 100).toFixed(1)}%</td>
                    <td className="py-2 px-3">
                      {t.Is_Correct ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px]">
                          <XCircle className="w-3 h-3" /> FAIL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-400">{t.Lighting}</td>
                    <td className="py-2 px-3 text-slate-400">{t.Latency_ms} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
