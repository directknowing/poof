import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const AMBIENT_OPTIONS = [
  { id: 'none', label: 'Silence' },
  { id: 'drone', label: 'Soft Drone' },
  { id: 'warmth', label: 'Warm Hum' },
];

function createAmbientNode(audioCtx, type) {
  if (type === 'none') return null;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.06;
  gain.connect(audioCtx.destination);

  if (type === 'drone') {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 136.1; // Om frequency
    osc.connect(gain);
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 272.2;
    const gain2 = audioCtx.createGain();
    gain2.gain.value = 0.03;
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc.start();
    osc2.start();
    return { stop: () => { osc.stop(); osc2.stop(); } };
  }

  if (type === 'warmth') {
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 0.5;

    const ambGain = audioCtx.createGain();
    ambGain.gain.value = 0.04;

    source.connect(filter);
    filter.connect(ambGain);
    ambGain.connect(audioCtx.destination);
    source.start();
    return { stop: () => source.stop() };
  }

  return null;
}

export default function AudioPlayer({ statements, activeIndex, onIndexChange }) {
  const { theme } = useTheme();
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speed, setSpeed] = useState(0.9);
  const [pauseDuration, setPauseDuration] = useState(2);
  const [loopCount, setLoopCount] = useState(1);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambient, setAmbient] = useState('none');
  const [showSettings, setShowSettings] = useState(false);

  const synthRef = useRef(window.speechSynthesis);
  const ambientRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const playingRef = useRef(false);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const v = synthRef.current.getVoices().filter(voice =>
        voice.lang.startsWith('en')
      );
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        setSelectedVoice(v[0].name);
      }
    };
    loadVoices();
    synthRef.current.addEventListener('voiceschanged', loadVoices);
    return () => synthRef.current.removeEventListener('voiceschanged', loadVoices);
  }, [selectedVoice]);

  const stopAll = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    synthRef.current.cancel();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (ambientRef.current) {
      try { ambientRef.current.stop(); } catch {}
      ambientRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, []);

  const speakStatement = useCallback((index, loop) => {
    if (!playingRef.current || index >= statements.length) {
      // End of sequence
      if (loop + 1 < loopCount && playingRef.current) {
        // Next loop
        setCurrentLoop(loop + 1);
        onIndexChange(0);
        speakStatement(0, loop + 1);
      } else {
        stopAll();
        onIndexChange(-1);
      }
      return;
    }

    onIndexChange(index);
    const utter = new SpeechSynthesisUtterance(statements[index]);
    utter.rate = speed;
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utter.voice = voice;

    utter.onend = () => {
      if (!playingRef.current) return;
      // Pause between statements
      pauseTimerRef.current = setTimeout(() => {
        speakStatement(index + 1, loop);
      }, pauseDuration * 1000);
    };

    synthRef.current.speak(utter);
  }, [statements, speed, selectedVoice, voices, pauseDuration, loopCount, stopAll, onIndexChange]);

  const startPlayback = useCallback(() => {
    playingRef.current = true;
    setIsPlaying(true);
    setCurrentLoop(0);

    // Start ambient
    if (ambient !== 'none') {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      ambientRef.current = createAmbientNode(audioCtxRef.current, ambient);
    }

    speakStatement(0, 0);
  }, [ambient, speakStatement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  return (
    <div className={`rounded-2xl p-4 ${
      theme === 'dark' ? 'bg-navy-light/50' : 'bg-cream-dark/50'
    }`}>
      {/* Controls row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium ${
          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
        }`}>
          AI Voice
        </span>
        <button
          onClick={() => setShowSettings(s => !s)}
          className={`text-xs px-2 py-1 rounded-md ${
            theme === 'dark' ? 'text-soft-white-dim hover:bg-navy-light' : 'text-charcoal-light hover:bg-cream-dark'
          }`}
        >
          {showSettings ? 'Hide' : 'Settings'}
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="space-y-3 mb-4">
          {/* Voice selection */}
          <div>
            <label className={`text-xs block mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className={`w-full px-2 py-1.5 rounded-lg text-sm border outline-none ${
                theme === 'dark'
                  ? 'bg-navy border-navy-light/50 text-soft-white'
                  : 'bg-white border-cream-dark text-charcoal'
              }`}
            >
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Speed */}
          <div>
            <label className={`text-xs block mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Speed: {speed}x</label>
            <input
              type="range"
              min="0.7"
              max="1.2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          {/* Pause duration */}
          <div>
            <label className={`text-xs block mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Pause between statements</label>
            <div className="flex gap-2">
              {[1, 2, 3, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setPauseDuration(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs ${
                    pauseDuration === s
                      ? theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                      : theme === 'dark' ? 'bg-navy text-soft-white-dim' : 'bg-white text-charcoal-light'
                  }`}
                >
                  {s}s
                </button>
              ))}
            </div>
          </div>

          {/* Loop count */}
          <div>
            <label className={`text-xs block mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Repeat</label>
            <div className="flex gap-2">
              {[1, 3, 7].map(n => (
                <button
                  key={n}
                  onClick={() => setLoopCount(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs ${
                    loopCount === n
                      ? theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                      : theme === 'dark' ? 'bg-navy text-soft-white-dim' : 'bg-white text-charcoal-light'
                  }`}
                >
                  {n}x
                </button>
              ))}
              <button
                onClick={() => setLoopCount(999)}
                className={`px-3 py-1.5 rounded-lg text-xs ${
                  loopCount === 999
                    ? theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                    : theme === 'dark' ? 'bg-navy text-soft-white-dim' : 'bg-white text-charcoal-light'
                }`}
              >
                Loop
              </button>
            </div>
          </div>

          {/* Ambient */}
          <div>
            <label className={`text-xs block mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Background</label>
            <div className="flex gap-2">
              {AMBIENT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAmbient(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs ${
                    ambient === opt.id
                      ? theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                      : theme === 'dark' ? 'bg-navy text-soft-white-dim' : 'bg-white text-charcoal-light'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Play button */}
      <div className="flex items-center gap-3">
        <button
          onClick={isPlaying ? stopAll : startPlayback}
          className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
            isPlaying
              ? theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-500/10 text-red-600'
              : theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
          }`}
        >
          {isPlaying ? 'Stop' : 'Play with Voice'}
        </button>
        {isPlaying && loopCount > 1 && (
          <span className={`text-xs ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            {currentLoop + 1}/{loopCount === 999 ? '\u221E' : loopCount}
          </span>
        )}
      </div>
    </div>
  );
}
