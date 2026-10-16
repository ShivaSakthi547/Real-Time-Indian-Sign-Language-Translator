import { Globe, Heart, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🤟</span>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                SignBridge
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Real-time sign language translation system combining Google MediaPipe 21-point 3D hand landmark tracking, geometric heuristics, and multilingual text-to-speech for accessible, barrier-free communication.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Python 3.11 + MediaPipe
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Real-time On-Device Inference
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button 
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Project Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('translator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Live Camera Translator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('library'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  10 Model Gestures Library
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('evaluation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Evaluation & Benchmark CSV
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Supported Languages
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['English', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'മലയാളം', 'ಕನ್ನಡ', 'বাংলা'].map((lang) => (
                <span 
                  key={lang}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 SignBridge Project. Built for College Hackathon & Accessible AI Demonstration.
          </p>
          <div className="flex items-center gap-2">
            <span>Powered by MediaPipe Solutions</span>
            <span>•</span>
            <span>FastAPI WebSocket</span>
            <span>•</span>
            <span>React + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
