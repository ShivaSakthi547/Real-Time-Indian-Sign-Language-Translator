import React, { useState } from 'react';
import { Search, Filter, Video, Layers, CheckCircle2, ChevronRight, Globe2, BookOpen } from 'lucide-react';
import { GESTURES, LANGUAGES } from '../data/constants';

export default function GestureLibraryPage({ setActivePage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedHandType, setSelectedHandType] = useState('ALL');

  const categories = ['ALL', 'Social', 'Commands', 'Responses', 'Actions'];
  const handTypes = ['ALL', 'Single Hand (1H)', 'Two Hands (2H)'];

  // Filter gestures
  const filteredGestures = GESTURES.filter(g => {
    const matchesSearch = 
      g.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(g.translations).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    const matchesHands = 
      selectedHandType === 'ALL' || 
      (selectedHandType.includes('1H') && g.hands === 1) || 
      (selectedHandType.includes('2H') && g.hands === 2);

    return matchesSearch && matchesCategory && matchesHands;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>OFFICIAL 10-CLASS MODEL SPECIFICATION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Sign Language Gesture Library
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Complete technical specification of the 10 gesture classes recognized by SignBridge's MediaPipe geometric analysis engine, along with full multilingual translations.
            </p>
          </div>

          <button
            onClick={() => setActivePage('translator')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-glow-cyan transition-all shrink-0"
          >
            <Video className="w-4 h-4 fill-navy-950" />
            <span>Test Signs with Camera</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by gesture name, meaning, or native translation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-navy-950/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/80"
            >
              {categories.map(c => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          {/* Hand Count Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedHandType}
              onChange={(e) => setSelectedHandType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-navy-950/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/80"
            >
              {handTypes.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Gesture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGestures.map((gesture, idx) => (
          <div 
            key={gesture.id}
            className="glass-card p-6 rounded-3xl border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-5 flex flex-col justify-between"
          >
            {/* Top Card Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-3xl shadow-glow-cyan">
                    {gesture.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">#{idx + 1}</span>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {gesture.label}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      {gesture.meaning}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    gesture.hands === 2 
                      ? 'bg-purple-950/60 border-purple-800/60 text-purple-300' 
                      : 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
                  }`}>
                    {gesture.hands === 2 ? 'Two Hands' : 'Single Hand'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium">
                    {gesture.category}
                  </span>
                </div>
              </div>

              {/* Physical Pose Description */}
              <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800/80 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Hand Anatomy Pose:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {gesture.description}
                </p>
              </div>

              {/* Geometric AI Rule */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3 h-3" /> MediaPipe Geometric Detection Rule:
                </span>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                  {gesture.rule}
                </p>
              </div>
            </div>

            {/* Multilingual Translation Table */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-cyan-400" /> Supported Translations:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {Object.entries(gesture.translations).map(([code, text]) => {
                  const langName = LANGUAGES.find(l => l.code === code)?.name || code;
                  return (
                    <div 
                      key={code}
                      className="p-2 rounded-xl bg-navy-950/80 border border-slate-800/80 flex flex-col"
                    >
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">{langName}</span>
                      <span className="text-xs font-bold text-white font-sans truncate">{text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActivePage('translator')}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Practice this sign in live camera</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredGestures.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <p className="text-base text-slate-300 font-semibold">No gestures match your query</p>
          <p className="text-xs text-slate-500">Try adjusting your search terms or filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setSelectedHandType('ALL'); }}
            className="px-4 py-2 rounded-xl bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
