import { useTheme } from '../../context/ThemeContext';
import { useDiscovery } from '../../context/DiscoveryContext';
import FadeIn from '../FadeIn';

export default function ScreenMonologue() {
  const { theme } = useTheme();
  const {
    monologues,
    selectedMonologues,
    setSelectedMonologues,
    confirmMonologues,
    goBack,
    isLoading,
  } = useDiscovery();

  const toggleMonologue = (m) => {
    setSelectedMonologues(prev => {
      if (prev.includes(m)) return prev.filter(x => x !== m);
      if (prev.length >= 3) return [...prev.slice(1), m];
      return [...prev, m];
    });
  };

  const canProceed = selectedMonologues.length > 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <FadeIn>
        <button
          onClick={goBack}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            theme === 'dark' ? 'text-soft-white-dim hover:text-soft-white' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </FadeIn>

      {/* Prompt */}
      <FadeIn delay={100}>
        <div className={`inline-block px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <p className="font-display text-xl font-medium leading-relaxed">
            Do any of these sound familiar?
          </p>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            Tap the ones that hit close to home.
          </p>
        </div>
      </FadeIn>

      {/* Monologue cards */}
      <div className="space-y-2.5">
        {monologues.map((m, i) => (
          <FadeIn key={i} delay={200 + i * 80}>
            <button
              onClick={() => toggleMonologue(m)}
              className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 border text-sm leading-relaxed italic ${
                selectedMonologues.includes(m)
                  ? theme === 'dark'
                    ? 'border-gold/60 bg-gold/10'
                    : 'border-gold-dark/40 bg-gold/10'
                  : theme === 'dark'
                    ? 'border-navy-light/50 bg-navy-light/30 hover:border-navy-light'
                    : 'border-cream-dark bg-white/50 hover:border-sage-light/50'
              }`}
            >
              &ldquo;{m}&rdquo;
            </button>
          </FadeIn>
        ))}
      </div>

      {/* Transition message + continue */}
      {canProceed && (
        <FadeIn delay={100}>
          <div className="space-y-4">
            <div className={`inline-block px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] ${
              theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
            }`}>
              <p className="text-sm leading-relaxed">
                That pattern made sense once. Now let&apos;s point you somewhere new.
              </p>
            </div>
            <button
              onClick={confirmMonologues}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gold text-navy-dark hover:bg-gold-light'
                  : 'bg-gold-dark text-cream hover:bg-gold'
              } ${isLoading ? 'opacity-50' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
