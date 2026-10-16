import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, VideoOff, RefreshCw, Volume2, VolumeX, Eye, EyeOff, 
  FlipHorizontal, CheckCircle2, AlertTriangle, Layers, Copy, Trash2, 
  Sparkles, Globe2, Radio, Send, Play
} from 'lucide-react';
import { LANGUAGES, GESTURES } from '../data/constants';
import { drawHandLandmarks } from '../utils/handLandmarks';

export default function TranslatorPage({ backendStatus, setBackendStatus }) {
  // Camera & Stream State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Settings
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Live Recognition State from Backend
  const [prediction, setPrediction] = useState({
    detected: false,
    gesture: null,
    confidence: 0,
    translation: '',
    language: 'en',
    stable_frames: 0,
    required_frames: 6,
    is_stable: false,
    latency_ms: 0,
    fps: 0,
    hands_count: 0,
  });

  // Sentence / History Builder
  const [sentence, setSentence] = useState([]);
  const [lastSpokenSign, setLastSpokenSign] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const canvasOverlayRef = useRef(null);
  const streamRef = useRef(null);
  const wsRef = useRef(null);
  const sendIntervalRef = useRef(null);
  const offscreenCanvasRef = useRef(document.createElement('canvas'));

  // ============================================================
  // WEBSOCKET CONNECTION TO PYTHON BACKEND
  // ============================================================
  const connectWebSocket = useCallback(() => {
    try {
      const wsUrl = `ws://${window.location.hostname || 'localhost'}:8000/ws/recognize`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setBackendStatus('online');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            console.warn('Backend warning:', data.error);
            return;
          }

          setPrediction(data);

          // Draw hand landmarks if overlay is enabled
          if (showSkeleton && canvasOverlayRef.current && videoRef.current) {
            const canvas = canvasOverlayRef.current;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            if (data.landmarks && data.landmarks.length > 0) {
              drawHandLandmarks(ctx, data.landmarks, w, h, isMirrored);
            } else {
              ctx.clearRect(0, 0, w, h);
            }
          }

          // Handle speech synthesis if a new stable gesture is confirmed
          if (!data.gesture) {
            setLastSpokenSign(null);
          } else if (data.is_stable && data.gesture && data.gesture !== lastSpokenSign) {
            setLastSpokenSign(data.gesture);
            if (autoSpeak) {
              speakText(data.translation || data.gesture, data.language);
            }
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = () => {
        setBackendStatus('offline');
      };

      ws.onclose = () => {
        setBackendStatus('offline');
      };

      wsRef.current = ws;
    } catch (e) {
      setBackendStatus('offline');
    }
  }, [showSkeleton, isMirrored, autoSpeak, lastSpokenSign, setBackendStatus]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);
    };
  }, [connectWebSocket]);

  // ============================================================
  // WEBCAM STREAM HANDLING
  // ============================================================
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraActive(true);
        };
      }
      streamRef.current = stream;

      // Start streaming frames to WebSocket
      startFrameStreaming();
    } catch (err) {
      console.error('Webcam access error:', err);
      let errorMsg = 'Could not access camera. Please verify camera permissions in your browser.';
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera permission was denied. Please allow camera access in browser address bar.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on your system. Please connect a webcam.';
      } else if (err.name === 'NotReadableError') {
        errorMsg = 'Camera is currently in use by another application. Please close other camera apps.';
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasOverlayRef.current) {
      const ctx = canvasOverlayRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasOverlayRef.current.width, canvasOverlayRef.current.height);
    }
    setIsCameraActive(false);
    setPrediction(prev => ({ ...prev, detected: false, gesture: null, confidence: 0, translation: '' }));
  };

  // Capture video frame and send over WebSocket at ~18 FPS
  const startFrameStreaming = () => {
    if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);

    sendIntervalRef.current = setInterval(() => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const video = videoRef.current;
      const offscreen = offscreenCanvasRef.current;
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;
      const aspect = vw / vh;
      const targetWidth = 800;
      const targetHeight = Math.round(800 / aspect);

      offscreen.width = targetWidth;
      offscreen.height = targetHeight;
      const ctx = offscreen.getContext('2d');

      // Draw mirrored if configured
      if (isMirrored) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -targetWidth, 0, targetWidth, targetHeight);
        ctx.restore();
      } else {
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
      }

      // Convert to JPEG base64 (quality 0.75 for clear hand features)
      const base64Data = offscreen.toDataURL('image/jpeg', 0.75);

      wsRef.current.send(JSON.stringify({
        image: base64Data,
        language: selectedLanguage
      }));
    }, 55); // ~18 FPS
  };

  // Adjust canvas overlay size to match video display size
  const handleVideoResize = () => {
    if (videoRef.current && canvasOverlayRef.current) {
      canvasOverlayRef.current.width = videoRef.current.videoWidth || 1280;
      canvasOverlayRef.current.height = videoRef.current.videoHeight || 720;
    }
  };

  // ============================================================
  // TEXT-TO-SPEECH
  // ============================================================
  const speakText = async (text, langCode) => {
    if (!text) return;

    // Try backend gTTS endpoint first for accurate regional language pronunciation
    try {
      const res = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: langCode })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio_base64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
          audio.play();
          return;
        }
      }
    } catch {
      // Fallback to browser SpeechSynthesis
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = langCode === 'hi' ? 'hi-IN' : langCode === 'te' ? 'te-IN' : langCode === 'ta' ? 'ta-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Append current stabilized word to sentence
  const appendToSentence = () => {
    if (prediction.translation || prediction.gesture) {
      const word = prediction.translation || prediction.gesture;
      setSentence(prev => [...prev, word]);
    }
  };

  const copySentence = () => {
    if (sentence.length === 0) return;
    navigator.clipboard.writeText(sentence.join(' '));
  };

  // Quick log trial into Evaluation Store
  const logCurrentTrial = async (isCorrect) => {
    if (!prediction.gesture) return;
    try {
      await fetch('http://localhost:8000/api/evaluation/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intended_gesture: prediction.gesture,
          predicted_gesture: prediction.gesture,
          confidence: prediction.confidence,
          is_correct: isCorrect,
          lighting: 'Live Webcam Session',
          camera: 'Browser WebRTC Stream',
          latency_ms: prediction.latency_ms || 30.0
        })
      });
    } catch (e) {
      console.error('Failed to log trial:', e);
    }
  };

  // Selected language object
  const currentLangObj = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner / Status Header */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Live Sign Language Translator
            </h1>
            <p className="text-xs text-slate-400">
              MediaPipe 21 Hand Landmarks • 10 Gestures • 7 Languages
            </p>
          </div>
        </div>

        {/* Live Metrics Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <span className="text-slate-400">Latency: </span>
            <span className="font-mono font-bold text-cyan-400">{prediction.latency_ms || 0} ms</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <span className="text-slate-400">Engine FPS: </span>
            <span className="font-mono font-bold text-emerald-400">{prediction.fps || 0}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <span className="text-slate-400">Hands: </span>
            <span className="font-mono font-bold text-cyan-300">{prediction.hands_count || 0}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
            backendStatus === 'online' 
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span>{backendStatus === 'online' ? 'Backend Ready' : 'Backend Offline'}</span>
          </div>
        </div>
      </div>

      {/* Backend Offline Notice */}
      {backendStatus !== 'online' && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">FastAPI Recognition Server Disconnected</p>
            <p className="text-xs text-amber-300/80 leading-relaxed">
              Start the backend with: <code className="bg-amber-900/40 px-2 py-0.5 rounded text-amber-200 font-mono">py -3.11 backend/server.py</code> (or <code className="bg-amber-900/40 px-2 py-0.5 rounded text-amber-200 font-mono">uvicorn backend.server:app --port 8000</code>). The web camera can still preview locally.
            </p>
          </div>
          <button 
            onClick={connectWebSocket}
            className="ml-auto px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800/60 text-xs font-semibold shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Camera Error Message */}
      {cameraError && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Webcam Permission or Hardware Error</p>
            <p className="text-xs text-rose-300/90 mt-1">{cameraError}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Video Stream (Left) vs Dashboard & Translation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Video Viewport & Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/9] w-full bg-navy-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            
            {/* HTML5 Video */}
            <video
              ref={videoRef}
              onLoadedMetadata={handleVideoResize}
              className={`w-full h-full object-cover ${isMirrored ? '-scale-x-100' : ''} ${!isCameraActive ? 'hidden' : ''}`}
              playsInline
              muted
            />

            {/* Canvas Overlay for Hand Landmarks */}
            <canvas
              ref={canvasOverlayRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />

            {/* Inactive State / Placeholder */}
            {!isCameraActive && (
              <div className="text-center p-8 space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
                  <VideoOff className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Camera is currently inactive</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Click 'Start Camera' below to initialize hand tracking and real-time translation.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
                >
                  Start Camera Feed
                </button>
              </div>
            )}

            {/* Active Floating Badges over Video */}
            {isCameraActive && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950/80 backdrop-blur border border-slate-700/80 text-[11px] font-semibold text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  LIVE
                </span>
                {prediction.is_stable && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur border border-emerald-600/60 text-[11px] font-bold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> STABILIZED
                  </span>
                )}
              </div>
            )}

            {/* Gesture Watermark on Video */}
            {isCameraActive && prediction.gesture && (
              <div className="absolute bottom-4 left-4 z-20 bg-navy-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-500/40 shadow-glow-cyan">
                <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Recognized Gesture
                </div>
                <div className="text-xl font-extrabold text-white">
                  {prediction.gesture}
                </div>
              </div>
            )}
          </div>

          {/* Video Control Bar */}
          <div className="glass-card p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold transition-all"
                >
                  <VideoOff className="w-4 h-4" /> Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold transition-all"
                >
                  <Video className="w-4 h-4" /> Start Camera
                </button>
              )}

              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className={`p-2 rounded-xl border transition-all ${
                  isMirrored 
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/30' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
                title="Toggle Mirror Mode"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowSkeleton(!showSkeleton)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                  showSkeleton 
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/30' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
                title="Toggle MediaPipe Hand Skeleton Overlay"
              >
                {showSkeleton ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>Hand Skeleton</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                  autoSpeak 
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700/60' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                <span>Auto Voice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Recognition & Translation Dashboard */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Language Selector Bar */}
          <div className="glass-card p-4 rounded-2xl space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" /> Target Translation Language:
              </span>
              <span className="font-mono text-cyan-400 font-bold uppercase">{selectedLanguage}</span>
            </div>

            {/* Language Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <div className="truncate">{lang.name}</div>
                    <div className="text-[10px] opacity-75 truncate">{lang.nativeName.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HERO Recognized Translation Card */}
          <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 relative overflow-hidden space-y-6 shadow-glow-cyan">
            
            {/* Top Card Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Recognized Meaning
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/60 text-cyan-300 font-medium">
                {currentLangObj.nativeName}
              </span>
            </div>

            {/* Big Hero Translation Display */}
            <div className="text-center py-2 space-y-2">
              {prediction.gesture ? (
                <>
                  {/* Primary Native Word */}
                  <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-white bg-clip-text font-sans tracking-tight">
                    {prediction.translation || prediction.gesture}
                  </div>
                  
                  {/* English Gesture Subtitle */}
                  <div className="text-sm text-slate-300 font-medium flex items-center justify-center gap-2">
                    <span>Sign:</span>
                    <span className="font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700">
                      {prediction.gesture}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-6 space-y-2">
                  <div className="text-3xl">✋</div>
                  <div className="text-lg font-semibold text-slate-400">
                    {isCameraActive ? 'Show a gesture in camera...' : 'Start camera to translate'}
                  </div>
                  <p className="text-xs text-slate-500">
                    Hold gesture steady for ~0.2s for debounced recognition.
                  </p>
                </div>
              )}
            </div>

            {/* Confidence & Stability Gauges */}
            {prediction.gesture && (
              <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
                {/* Confidence Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Model Confidence</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(prediction.confidence * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Debounce Stability Progress (6 frames) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Debounce Stability</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {prediction.stable_frames} / {prediction.required_frames} frames
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 h-1.5">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div 
                        key={i}
                        className={`rounded-full transition-colors ${
                          i <= prediction.stable_frames 
                            ? 'bg-emerald-400 shadow-glow-emerald' 
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Bar for the Recognized Word */}
            {prediction.gesture && (
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => speakText(prediction.translation || prediction.gesture, selectedLanguage)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>Pronounce</span>
                </button>

                <button
                  onClick={appendToSentence}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Add to Sentence</span>
                </button>

                <button
                  onClick={() => logCurrentTrial(true)}
                  className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-medium text-slate-400 hover:text-slate-200"
                  title="Record prediction into Evaluation Dashboard"
                >
                  ✓ Log Trial
                </button>
              </div>
            )}
          </div>

          {/* Sentence / History Builder */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Live Communication Log</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySentence}
                  disabled={sentence.length === 0}
                  className="text-slate-400 hover:text-cyan-400 disabled:opacity-30"
                  title="Copy Sentence"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSentence([])}
                  disabled={sentence.length === 0}
                  className="text-slate-400 hover:text-rose-400 disabled:opacity-30"
                  title="Clear Sentence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="min-h-[60px] p-3 rounded-xl bg-navy-950/80 border border-slate-800/90 text-sm">
              {sentence.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {sentence.map((w, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-medium"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  Recognized signs will append here to construct conversational phrases...
                </span>
              )}
            </div>

            {sentence.length > 0 && (
              <button
                onClick={() => speakText(sentence.join(' '), selectedLanguage)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" /> Speak Complete Phrase
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
