import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useDiscovery } from '../../context/DiscoveryContext';
import FadeIn from '../FadeIn';

export default function ScreenConfirm() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { getSummary, goBack } = useDiscovery();
  const summary = getSummary();

  const handleGenerate = () => {
    // In Step 5, this will trigger affirmation generation.
    // For now, navigate to practice as a placeholder.
    navigate('/practice');
  };

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

      {/* Summary */}
      <FadeIn delay={100}>
        <div className={`inline-block px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <p className="font-display text-xl font-medium leading-relaxed">
            Here&apos;s what I&apos;m hearing.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={250}>
        <div className={`p-5 rounded-2xl space-y-4 ${
          theme === 'dark' ? 'bg-navy-light/50' : 'bg-white/60'
        } border ${
          theme === 'dark' ? 'border-navy-light/50' : 'border-cream-dark'
        }`}>
          {/* Area */}
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Area</p>
            <p className="font-medium text-sm">{summary.area?.label}</p>
          </div>

          {/* Old pattern */}
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>The old pattern</p>
            <div className="space-y-1">
              {summary.monologues.map((m, i) => (
                <p key={i} className="text-sm italic">&ldquo;{m}&rdquo;</p>
              ))}
            </div>
          </div>

          {/* New direction */}
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Where you&apos;re headed</p>
            <div className="space-y-1">
              {summary.identities.map((id, i) => (
                <p key={i} className="text-sm">{id}</p>
              ))}
              {summary.customIdentity && (
                <p className="text-sm">{summary.customIdentity}</p>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Actions */}
      <FadeIn delay={400}>
        <div className="space-y-3">
          <button
            onClick={handleGenerate}
            className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gold text-navy-dark hover:bg-gold-light'
                : 'bg-gold-dark text-cream hover:bg-gold'
            } hover:scale-[1.01] active:scale-[0.99]`}
          >
            Generate My Affirmation
          </button>
          <button
            onClick={goBack}
            className={`w-full py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              theme === 'dark'
                ? 'text-soft-white-dim hover:text-soft-white'
                : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            Go back and adjust
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
