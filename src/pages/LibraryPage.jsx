import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import PageShell from '../components/PageShell';

export default function LibraryPage() {
  const { theme } = useTheme();
  const { affirmations } = useApp();

  return (
    <PageShell>
      <h1 className="font-display text-3xl font-semibold mb-6">Library</h1>
      {affirmations.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className={`text-base mb-6 ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            Your affirmation sequences will appear here.
          </p>
          <Link
            to="/discover"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-navy-light text-soft-white hover:bg-navy-light/80'
                : 'bg-cream-dark text-charcoal hover:bg-cream-dark/80'
            }`}
          >
            Create Your First Affirmation
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {affirmations.map(a => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl ${
                theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
              }`}
            >
              <h3 className="font-display text-lg font-semibold">{a.area}</h3>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>
                {a.statements?.length || 0} statements
              </p>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
