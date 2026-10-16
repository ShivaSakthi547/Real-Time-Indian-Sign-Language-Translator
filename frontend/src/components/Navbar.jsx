import React, { useState } from 'react';
import { Video, BookOpen, BarChart3, Home, Zap, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, backendStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'translator', label: 'Live Translator', icon: Video, badge: 'Live AI' },
    { id: 'library', label: 'Gesture Library', icon: BookOpen },
    { id: 'evaluation', label: 'Evaluation', icon: BarChart3 },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-glow-cyan flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🤟</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  SignBridge
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 uppercase tracking-wider">
                  AI v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Sign Language Communication Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-navy-900/60 p-1.5 rounded-2xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Status Indicator & Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Backend connection pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              backendStatus === 'online'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                : backendStatus === 'connecting'
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  backendStatus === 'online' ? 'bg-emerald-400' : backendStatus === 'connecting' ? 'bg-amber-400' : 'bg-rose-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  backendStatus === 'online' ? 'bg-emerald-500' : backendStatus === 'connecting' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
              </span>
              <span>
                {backendStatus === 'online' ? 'AI Engine Ready' : backendStatus === 'connecting' ? 'Connecting Engine...' : 'Backend Offline'}
              </span>
            </div>

            {/* Quick Launch CTA */}
            {activePage !== 'translator' && (
              <button
                onClick={() => handleNavClick('translator')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-navy-950" />
                <span>Launch Translator</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-navy-900/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-cyan-500/20 text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
              backendStatus === 'online'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span>{backendStatus === 'online' ? 'MediaPipe AI Engine Online' : 'FastAPI Backend Offline'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
