import React from 'react';
import { ArrowRight, Video, Sparkles, Shield, Cpu, Volume2, Globe2, Layers, CheckCircle2, Award } from 'lucide-react';
import { GESTURES, LANGUAGES } from '../data/constants';

export default function HomePage({ setActivePage, backendStatus }) {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="relative text-center space-y-8 pt-4 pb-12">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-semibold tracking-wide shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI-POWERED ASSISTIVE COMMUNICATION • COLLEGE HACKATHON 2026</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
            Bridging Silence with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Real-Time AI
            </span>{' '}
            Sign Translation
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Instantly translate hand gestures into text and natural speech across 
            <span className="text-cyan-400 font-semibold"> 7 Indian languages</span> using 
            21-point 3D MediaPipe hand tracking and low-latency computer vision heuristics.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('translator')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-base shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
          >
            <Video className="w-5 h-5 fill-navy-950" />
            <span>Start Live Translating</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setActivePage('library')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl glass-card text-slate-200 hover:text-white hover:border-cyan-500/50 font-semibold text-base transition-all"
          >
            <span>Explore 10 Model Gestures</span>
          </button>
          
          <button
            onClick={() => setActivePage('evaluation')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl glass-card text-slate-200 hover:text-white hover:border-cyan-500/50 font-semibold text-base transition-all"
          >
            <span>View Benchmark Data</span>
          </button>
        </div>

        {/* Live System Status Banner */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass-card text-xs text-slate-300">
            <span className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>
              {backendStatus === 'online' 
                ? 'Python MediaPipe Backend: Connected & Ready for 30 FPS Stream'
                : 'Python Backend Offline: Launch server.py to enable live webcam AI inference'}
            </span>
          </div>
        </div>

        {/* Feature Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-5xl mx-auto">
          {[
            { label: 'Supported Gestures', value: '10', detail: 'Single & Two-Handed' },
            { label: 'Multilingual Support', value: '7 Languages', detail: 'English + 6 Indian Regional' },
            { label: 'Landmark Fidelity', value: '21 3D Points', detail: 'Real-time Skeletal Tracking' },
            { label: 'Benchmark Accuracy', value: '93.0%', detail: 'Tested on 100 Live Trials' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl text-left border border-slate-800/80 hover:border-cyan-500/30 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How SignBridge Recognizes Signs
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            An end-to-end, zero-latency computer vision pipeline running directly on standard webcam streams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Webcam Capture',
              desc: 'Browser streams front-facing video frames at 30 FPS over an asynchronous WebSocket connection to avoid camera hardware locks.',
              icon: Video,
            },
            {
              step: '02',
              title: 'MediaPipe 3D Landmarks',
              desc: 'Google MediaPipe extracts 21 3D spatial coordinates per hand normalized across the camera canvas with sub-millimeter precision.',
              icon: Cpu,
            },
            {
              step: '03',
              title: 'Geometric Classification',
              desc: 'Calculates 3D Euclidean distances between wrist and fingertips vs PIP joints, followed by a 6-frame debounce filter to kill jitter.',
              icon: Layers,
            },
            {
              step: '04',
              title: 'Speech & Translation',
              desc: 'Instantly maps the gesture to 7 regional scripts (Hindi, Telugu, Tamil, etc.) and synthesizes audible speech.',
              icon: Volume2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                <div className="text-4xl font-black text-slate-800/60 mb-4 select-none group-hover:text-cyan-900/60 transition-colors">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Gestures Preview Grid */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Model Gesture Repertoire
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Currently recognizes 10 predefined signs with verified geometric heuristics.
            </p>
          </div>
          <button
            onClick={() => setActivePage('library')}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold group"
          >
            <span>View Full Details & Rules</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {GESTURES.map((g) => (
            <div 
              key={g.id}
              onClick={() => setActivePage('library')}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:border-cyan-500/40 hover:-translate-y-1 transition-all group"
            >
              <div className="text-3xl mb-3 text-center group-hover:scale-110 transition-transform">
                {g.icon}
              </div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {g.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {g.hands}H
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                {g.meaning}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400">
                <span>Telugu:</span>
                <span className="font-medium text-slate-200">{g.translations.te}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multilingual Support Showcase */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Full Unicode Regional Localization</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              7 Languages with Native Script Typography
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              SignBridge breaks language barriers by translating recognition output into major regional Indian languages. Using native Microsoft Nirmala UI and Google Noto Unicode fonts, glyphs render crisp with zero missing character boxes.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {LANGUAGES.map((l) => (
                <div key={l.code} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{l.name}</span>
                    <span className="text-slate-400 ml-1.5 font-sans">({l.nativeName.split(' ')[0]})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Translation Matrix Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
              <span className="font-semibold text-slate-200">Live Translation Matrix Preview</span>
              <span className="text-cyan-400">Gesture: YES (Thumbs Up)</span>
            </div>
            
            <div className="space-y-2.5 font-sans">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-xs text-slate-400">English</span>
                <span className="text-sm font-bold text-white">Yes</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                <span className="text-xs text-cyan-300 font-semibold">Telugu (తెలుగు)</span>
                <span className="text-base font-bold text-cyan-300">అవును</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-xs text-slate-400">Hindi (हिन्दी)</span>
                <span className="text-sm font-bold text-white">हाँ</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-xs text-slate-400">Tamil (தமிழ்)</span>
                <span className="text-sm font-bold text-white">ஆம்</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-xs text-slate-400">Malayalam (മലയാളം)</span>
                <span className="text-sm font-bold text-white">അതെ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon CTA Banner */}
      <section className="text-center py-12 px-6 glass-panel rounded-3xl border border-cyan-500/30 shadow-glow-cyan space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Experience Real-Time Translation Right Now
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
          Allow browser webcam access, face the camera, and perform any of the 10 gestures to see instant hand skeletons and multi-lingual voice translation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('translator')}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-base shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
          >
            <Video className="w-5 h-5 fill-navy-950" />
            <span>Open Live Translator</span>
          </button>
          <button
            onClick={() => setActivePage('evaluation')}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl glass-card text-slate-200 hover:text-white hover:border-cyan-500/40 font-semibold text-sm transition-all"
          >
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Inspect Benchmark Results</span>
          </button>
        </div>
      </section>

    </div>
  );
}
