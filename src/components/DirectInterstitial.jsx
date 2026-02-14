import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const PRINCIPLES = [
  {
    letter: 'D',
    name: 'Declare',
    tagline: 'Stated as now. Not someday.',
    detail: 'Your subconscious doesn\'t process future tense as instruction. We don\'t say "I will be" or "I want." We say "I am," "I have," "I move." This is declaration, not wishing.',
  },
  {
    letter: 'I',
    name: 'Identity',
    tagline: 'Who you\'re becoming, not what you\'re getting.',
    detail: 'We affirm who you\'re becoming, not the external thing you want. "I am someone who builds wealth naturally" rather than "I have $100,000." Your mind can\'t argue with who you are the way it argues with what you have.',
  },
  {
    letter: 'R',
    name: 'Rising Trajectory',
    tagline: 'Language of movement. You\'re already in motion.',
    detail: 'Language of expansion and upward movement — "more and more," "increasingly," "deepening." This acknowledges you\'re already in motion rather than starting from zero. You\'re not creating momentum from nothing — you\'re aligning with momentum that already exists.',
  },
  {
    letter: 'E',
    name: 'Emotionally Charged',
    tagline: 'If it doesn\'t make you feel something, it won\'t work.',
    detail: 'Thought without feeling is a wire without current. If it reads like a legal document, it\'s dead. Every statement needs at least one word that moves you — "powerfully," "joyfully," "effortlessly," "with deep confidence."',
  },
  {
    letter: 'C',
    name: 'Concise',
    tagline: 'One breath. That\'s the test.',
    detail: 'If you can\'t say it in one breath, it\'s too complicated for the deeper mind to hold. The subconscious latches onto rhythm and brevity. Think mantra-like, not paragraph-like.',
  },
  {
    letter: 'T',
    name: 'True North',
    tagline: 'Nothing your own mind will fight.',
    detail: 'If any part of you recoils and says "that\'s a lie," the affirmation works against itself. Trajectory language — "I am moving toward," "I am increasingly" — sidesteps this. Your mind can\'t argue with direction the way it argues with absolute claims.',
  },
];

export default function DirectInterstitial({ onComplete }) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [allShown, setAllShown] = useState(false);

  useEffect(() => {
    // Show each principle with a 3-second interval
    const timers = PRINCIPLES.map((_, i) =>
      setTimeout(() => setActiveIndex(i), (i + 1) * 800)
    );

    // Mark all shown after last one
    timers.push(
      setTimeout(() => setAllShown(true), (PRINCIPLES.length + 1) * 800)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const toggleExpand = (i) => {
    setExpandedIndex(prev => prev === i ? null : i);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 ${
      theme === 'dark' ? 'bg-navy text-soft-white' : 'bg-cream text-charcoal'
    }`}>
      <div className="max-w-md w-full">
        {/* Title */}
        <div className={`text-center mb-10 transition-opacity duration-500 ${
          activeIndex >= 0 ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className={`text-sm tracking-widest uppercase mb-2 ${
            theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'
          }`}>
            Crafting your affirmation with
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-wide">
            D-I-R-E-C-T
          </h2>
        </div>

        {/* Principles */}
        <div className="space-y-3">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.letter}
              className={`transition-all duration-500 ease-out ${
                i <= activeIndex
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={() => toggleExpand(i)}
                disabled={i > activeIndex}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  i === activeIndex && !allShown
                    ? theme === 'dark'
                      ? 'bg-gold/15 border border-gold/30'
                      : 'bg-gold/10 border border-gold-dark/20'
                    : theme === 'dark'
                      ? 'bg-navy-light/40 border border-transparent hover:border-navy-light/50'
                      : 'bg-white/40 border border-transparent hover:border-cream-dark/50'
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`font-display text-2xl font-bold ${
                    theme === 'dark' ? 'text-gold' : 'text-gold-dark'
                  }`}>
                    {p.letter}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{p.name}</span>
                    <span className={`text-sm ml-2 ${
                      theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                    }`}>
                      — {p.tagline}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedIndex === i && (
                  <p className={`mt-2 text-sm leading-relaxed pl-9 ${
                    theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                  }`}>
                    {p.detail}
                  </p>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Continue button */}
        {allShown && onComplete && (
          <div className={`mt-8 text-center transition-opacity duration-500 ${
            allShown ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={onComplete}
              className={`px-8 py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gold text-navy-dark hover:bg-gold-light'
                  : 'bg-gold-dark text-cream hover:bg-gold'
              } hover:scale-[1.01] active:scale-[0.99]`}
            >
              See Your Affirmation
            </button>
          </div>
        )}

        {/* Loading indicator when no onComplete (still generating) */}
        {!onComplete && allShown && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className={`text-sm ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>
              Your affirmation is being crafted...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
