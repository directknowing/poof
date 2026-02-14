import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useDiscovery } from '../../context/DiscoveryContext';
import FadeIn from '../FadeIn';

export default function ScreenIdentity() {
  const { theme } = useTheme();
  const {
    identities,
    selectedIdentities,
    setSelectedIdentities,
    customIdentity,
    setCustomIdentity,
    confirmIdentities,
    goBack,
  } = useDiscovery();

  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleIdentity = (id) => {
    setSelectedIdentities(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const canProceed = selectedIdentities.length > 0 || customIdentity.trim().length > 0;

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
            Which of these feel like the version of you that&apos;s emerging?
          </p>
        </div>
      </FadeIn>

      {/* Identity cards */}
      <div className="space-y-2.5">
        {identities.map((id, i) => (
          <FadeIn key={i} delay={200 + i * 80}>
            <button
              onClick={() => toggleIdentity(id)}
              className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 border text-sm leading-relaxed ${
                selectedIdentities.includes(id)
                  ? theme === 'dark'
                    ? 'border-gold/60 bg-gold/10'
                    : 'border-gold-dark/40 bg-gold/10'
                  : theme === 'dark'
                    ? 'border-navy-light/50 bg-navy-light/30 hover:border-navy-light'
                    : 'border-cream-dark bg-white/50 hover:border-sage-light/50'
              }`}
            >
              {id}
            </button>
          </FadeIn>
        ))}

        {/* Write your own */}
        <FadeIn delay={200 + identities.length * 80}>
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border text-sm ${
                theme === 'dark'
                  ? 'border-navy-light/30 text-soft-white-dim hover:border-navy-light/50'
                  : 'border-cream-dark/50 text-charcoal-light hover:border-cream-dark'
              }`}
            >
              Write your own...
            </button>
          ) : (
            <input
              type="text"
              value={customIdentity}
              onChange={(e) => setCustomIdentity(e.target.value)}
              placeholder="Someone who..."
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

      {/* Continue */}
      {canProceed && (
        <FadeIn delay={100}>
          <button
            onClick={confirmIdentities}
            className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gold text-navy-dark hover:bg-gold-light'
                : 'bg-gold-dark text-cream hover:bg-gold'
            } hover:scale-[1.01] active:scale-[0.99]`}
          >
            Continue
          </button>
        </FadeIn>
      )}
    </div>
  );
}
