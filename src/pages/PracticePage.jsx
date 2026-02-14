import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import PageShell from '../components/PageShell';
import PostPracticeCheckIn from '../components/PostPracticeCheckIn';
import AudioPlayer from '../components/AudioPlayer';
import VoiceRecorder from '../components/VoiceRecorder';

function AnimatedBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      // Gentle gradient shift
      const hue1 = theme === 'dark' ? 230 : 120;
      const hue2 = theme === 'dark' ? 245 : 90;
      const sat = theme === 'dark' ? 30 : 15;
      const light1 = theme === 'dark' ? 15 : 96;
      const light2 = theme === 'dark' ? 18 : 93;

      const offset = Math.sin(t) * 10;
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, `hsl(${hue1 + offset}, ${sat}%, ${light1}%)`);
      grad.addColorStop(0.5, `hsl(${(hue1 + hue2) / 2 + offset}, ${sat - 5}%, ${(light1 + light2) / 2}%)`);
      grad.addColorStop(1, `hsl(${hue2 + offset}, ${sat}%, ${light2}%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Soft floating orbs
      for (let i = 0; i < 4; i++) {
        const x = w * (0.2 + 0.6 * Math.sin(t * 0.5 + i * 1.5));
        const y = h * (0.2 + 0.6 * Math.cos(t * 0.4 + i * 2));
        const r = Math.min(w, h) * (0.15 + 0.05 * Math.sin(t + i));
        const orb = ctx.createRadialGradient(x, y, 0, x, y, r);
        const alpha = theme === 'dark' ? 0.04 : 0.06;
        const orbHue = theme === 'dark' ? 45 : 45;
        orb.addColorStop(0, `hsla(${orbHue}, 50%, 60%, ${alpha})`);
        orb.addColorStop(1, 'transparent');
        ctx.fillStyle = orb;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function PracticeView({ affirmation, theme }) {
  const { saveAffirmation } = useApp();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const statements = affirmation.statements || [];

  const startPractice = useCallback(() => {
    setIsPaused(false);
    setActiveIndex(0);
  }, []);

  const pausePractice = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const resetPractice = useCallback(() => {
    setIsPaused(true);
    setActiveIndex(-1);
    setShowCheckIn(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCheckInComplete = useCallback((feeling) => {
    const session = {
      date: new Date().toISOString(),
      feeling,
    };
    const updated = {
      ...affirmation,
      progress: {
        ...affirmation.progress,
        sessions: [...(affirmation.progress?.sessions || []), session],
      },
    };
    saveAffirmation(updated);
    setShowCheckIn(false);
    resetPractice();
  }, [affirmation, saveAffirmation, resetPractice]);

  // Auto-advance through statements
  useEffect(() => {
    if (isPaused || activeIndex < 0 || activeIndex >= statements.length) return;

    timerRef.current = setTimeout(() => {
      if (activeIndex < statements.length - 1) {
        setActiveIndex(prev => prev + 1);
      } else {
        setIsPaused(true);
        setShowCheckIn(true);
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, activeIndex, statements.length]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen flex flex-col ${
        isFullscreen ? 'pb-0' : 'pb-20'
      }`}
    >
      <AnimatedBackground theme={theme} />

      {/* Post-practice check-in */}
      {showCheckIn && (
        <PostPracticeCheckIn onComplete={handleCheckInComplete} />
      )}

      {/* Top controls */}
      <div className="relative z-10 flex justify-between items-center px-4 pt-4">
        <p className={`text-xs tracking-wider uppercase ${
          theme === 'dark' ? 'text-soft-white-dim/60' : 'text-charcoal-light/60'
        }`}>
          {affirmation.area}
        </p>
        <button
          onClick={toggleFullscreen}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'text-soft-white-dim/60 hover:text-soft-white-dim' : 'text-charcoal-light/60 hover:text-charcoal-light'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            )}
          </svg>
        </button>
      </div>

      {/* Statements */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-8 max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {statements.map((stmt, i) => (
            <p
              key={i}
              className={`font-display text-xl md:text-2xl leading-relaxed transition-all duration-700 ease-out ${
                activeIndex === -1
                  ? theme === 'dark' ? 'text-soft-white/80' : 'text-charcoal/80'
                  : i === activeIndex
                    ? `scale-[1.02] ${theme === 'dark' ? 'text-soft-white' : 'text-charcoal'}`
                    : i < activeIndex
                      ? theme === 'dark' ? 'text-soft-white/30' : 'text-charcoal/30'
                      : theme === 'dark' ? 'text-soft-white/15' : 'text-charcoal/15'
              }`}
            >
              {stmt}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-6 pb-6 flex flex-col items-center gap-4">
        {/* Progress indicator */}
        {activeIndex >= 0 && (
          <div className="flex gap-1">
            {statements.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= activeIndex ? 'w-6 bg-gold' : 'w-1.5 bg-gold/20'
                }`}
              />
            ))}
          </div>
        )}

        {/* Play controls */}
        <div className="flex items-center gap-4">
          {activeIndex >= 0 && (
            <button
              onClick={resetPractice}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'text-soft-white-dim hover:text-soft-white' : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903H14.25a.75.75 0 000 1.5h6a.75.75 0 00.75-.75v-6a.75.75 0 00-1.5 0v3.068l-1.658-1.657A9 9 0 013.259 9.584a.75.75 0 101.496.15v-.001l-.001.001v.325zM19.245 13.941a7.5 7.5 0 01-12.548 3.364L4.794 15.4H9.75a.75.75 0 000-1.5h-6a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-3.068l1.658 1.657A9 9 0 0020.741 14.416a.75.75 0 10-1.496-.15v.001l.001-.001v-.325z" />
              </svg>
            </button>
          )}

          <button
            onClick={isPaused ? startPractice : pausePractice}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
              theme === 'dark'
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-gold-dark/10 text-gold-dark border border-gold-dark/20'
            }`}
          >
            {isPaused ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-0.5">
                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {activeIndex >= 0 && (
            <button
              onClick={() => setActiveIndex(i => Math.min(statements.length - 1, i + 1))}
              disabled={activeIndex >= statements.length - 1}
              className={`p-2 rounded-full transition-colors ${
                activeIndex >= statements.length - 1
                  ? 'opacity-30'
                  : theme === 'dark' ? 'text-soft-white-dim hover:text-soft-white' : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653zm14.25.75a.75.75 0 01.75.75v9.75a.75.75 0 01-1.5 0v-9.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Audio Player & Voice Recorder */}
        <div className="w-full max-w-lg space-y-3">
          <AudioPlayer
            statements={statements}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />
          <VoiceRecorder
            statements={statements}
            affirmation={affirmation}
          />
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  const { theme } = useTheme();
  const { activeAffirmation, apiKey } = useApp();

  if (!activeAffirmation) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
          }`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`w-10 h-10 ${
              theme === 'dark' ? 'text-gold' : 'text-gold-dark'
            }`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 3.358-9 7.5 0 2.072 1.078 3.943 2.81 5.28l-.56 3.72 3.28-1.64c1.08.36 2.24.56 3.47.56 4.97 0 9-3.358 9-7.5S16.97 3 12 3z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-semibold mb-3">Welcome to Affirm</h1>
          <p className={`text-base mb-8 max-w-xs ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            Discover what you truly need to affirm and build a practice that transforms.
          </p>
          {!apiKey && (
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>
              First, add your Claude API key in{' '}
              <Link to="/settings" className="text-gold-dark underline underline-offset-2">Settings</Link>
            </p>
          )}
          <Link
            to="/discover"
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-medium text-base transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gold text-navy-dark hover:bg-gold-light'
                : 'bg-gold-dark text-cream hover:bg-gold'
            } hover:scale-[1.02] active:scale-[0.98]`}
          >
            Begin Discovery
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </PageShell>
    );
  }

  return <PracticeView affirmation={activeAffirmation} theme={theme} />;
}
