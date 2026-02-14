import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import PageShell from '../components/PageShell';

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
            } ${!apiKey ? 'opacity-50 pointer-events-none' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
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

  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="font-display text-3xl font-semibold mb-6">Your Practice</h1>
        <p className={`text-sm mb-2 ${
          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
        }`}>
          {activeAffirmation.area}
        </p>
        <div className="space-y-4 mt-6 text-left w-full">
          {activeAffirmation.statements?.map((s, i) => (
            <p key={i} className="font-display text-xl leading-relaxed">
              {s}
            </p>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
