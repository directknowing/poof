import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useDiscovery } from '../../context/DiscoveryContext';
import FadeIn from '../FadeIn';

export default function ScreenArea() {
  const { theme } = useTheme();
  const {
    lifeAreas,
    selectedArea,
    selectArea,
    subOptions,
    selectedSubOptions,
    setSelectedSubOptions,
    customSubOption,
    setCustomSubOption,
    confirmSubOptions,
    isLoading,
    error,
  } = useDiscovery();

  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleSubOption = (option) => {
    setSelectedSubOptions(prev => {
      if (prev.includes(option)) return prev.filter(o => o !== option);
      if (prev.length >= 2) return [...prev.slice(1), option];
      return [...prev, option];
    });
  };

  const canProceed = selectedSubOptions.length > 0 || customSubOption.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <FadeIn>
        <div className={`inline-block px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <p className="font-display text-xl font-medium leading-relaxed">
            What area of your life is asking for attention right now?
          </p>
        </div>
      </FadeIn>

      {/* Life area cards */}
      <div className="grid grid-cols-1 gap-2.5">
        {lifeAreas.map((area, i) => (
          <FadeIn key={area.id} delay={100 + i * 60}>
            <button
              onClick={() => selectArea(area)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-200 border ${
                selectedArea?.id === area.id
                  ? theme === 'dark'
                    ? 'border-gold/60 bg-gold/10'
                    : 'border-gold-dark/40 bg-gold/10'
                  : theme === 'dark'
                    ? 'border-navy-light/50 bg-navy-light/30 hover:border-navy-light active:scale-[0.98]'
                    : 'border-cream-dark bg-white/50 hover:border-sage-light/50 active:scale-[0.98]'
              }`}
            >
              <p className="font-medium text-[15px]">{area.label}</p>
              <p className={`text-xs mt-0.5 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>{area.subtext}</p>
            </button>
          </FadeIn>
        ))}
      </div>

      {/* Loading state */}
      {selectedArea && isLoading && subOptions.length === 0 && (
        <FadeIn delay={100}>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className={`text-sm ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Thinking about your situation...</p>
          </div>
        </FadeIn>
      )}

      {/* Error message */}
      {error && (
        <FadeIn delay={50}>
          <p className="text-sm text-amber-600 dark:text-amber-400 px-4">{error}</p>
        </FadeIn>
      )}

      {/* Sub-options (appear after area selection) */}
      {selectedArea && subOptions.length > 0 && (
        <FadeIn delay={100}>
          <div className="space-y-4 mt-2">
            <div className={`inline-block px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] ${
              theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
            }`}>
              <p className="text-sm leading-relaxed">
                Can you narrow it down? What feels most true?
              </p>
            </div>

            <div className="space-y-2">
              {subOptions.map((option, i) => (
                <FadeIn key={i} delay={50 + i * 60}>
                  <button
                    onClick={() => toggleSubOption(option)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border text-sm ${
                      selectedSubOptions.includes(option)
                        ? theme === 'dark'
                          ? 'border-gold/60 bg-gold/10'
                          : 'border-gold-dark/40 bg-gold/10'
                        : theme === 'dark'
                          ? 'border-navy-light/50 bg-navy-light/30 hover:border-navy-light'
                          : 'border-cream-dark bg-white/50 hover:border-sage-light/50'
                    }`}
                  >
                    {option}
                  </button>
                </FadeIn>
              ))}

              {/* Something else option */}
              <FadeIn delay={50 + subOptions.length * 60}>
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border text-sm ${
                      theme === 'dark'
                        ? 'border-navy-light/30 text-soft-white-dim hover:border-navy-light/50'
                        : 'border-cream-dark/50 text-charcoal-light hover:border-cream-dark'
                    }`}
                  >
                    Something else...
                  </button>
                ) : (
                  <input
                    type="text"
                    value={customSubOption}
                    onChange={(e) => setCustomSubOption(e.target.value)}
                    placeholder="What's going on for you..."
                    autoFocus
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                      theme === 'dark'
                        ? 'border-gold/40 bg-navy-light/30 text-soft-white placeholder-soft-white-dim/40'
                        : 'border-gold-dark/30 bg-white/50 text-charcoal placeholder-charcoal-light/40'
                    }`}
                  />
                )}
              </FadeIn>
            </div>

            {/* Continue button */}
            {canProceed && (
              <FadeIn delay={100}>
                <button
                  onClick={confirmSubOptions}
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-gold text-navy-dark hover:bg-gold-light'
                      : 'bg-gold-dark text-cream hover:bg-gold'
                  } ${isLoading ? 'opacity-50' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
                >
                  {isLoading ? 'Loading...' : 'Continue'}
                </button>
              </FadeIn>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
