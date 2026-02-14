import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import PageShell from '../components/PageShell';
import FadeIn from '../components/FadeIn';

export default function LibraryPage() {
  const { theme } = useTheme();
  const { affirmations, activeAffirmationId, setActiveAffirmation, deleteAffirmation } = useApp();

  const active = affirmations.filter(a => !a.archived);
  const archived = affirmations.filter(a => a.archived);

  const handleSetActive = (id) => {
    setActiveAffirmation(id);
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Library</h1>
        <Link
          to="/discover"
          className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-gold/20 text-gold hover:bg-gold/30'
              : 'bg-gold/20 text-gold-dark hover:bg-gold/30'
          }`}
        >
          + New
        </Link>
      </div>

      {affirmations.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
          }`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`w-8 h-8 ${
              theme === 'dark' ? 'text-gold/50' : 'text-gold-dark/50'
            }`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className={`text-base mb-6 ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            Your affirmation sequences will appear here.
          </p>
          <Link
            to="/discover"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gold text-navy-dark hover:bg-gold-light'
                : 'bg-gold-dark text-cream hover:bg-gold'
            }`}
          >
            Create Your First Affirmation
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active practices */}
          {active.length > 0 && (
            <div className="space-y-3">
              <p className={`text-xs uppercase tracking-wider ${
                theme === 'dark' ? 'text-gold/70' : 'text-gold-dark/70'
              }`}>
                Active Practices
              </p>
              {active.map((a, i) => (
                <FadeIn key={a.id} delay={i * 60}>
                  <div className={`p-4 rounded-2xl border ${
                    a.id === activeAffirmationId
                      ? theme === 'dark'
                        ? 'border-gold/40 bg-gold/5'
                        : 'border-gold-dark/30 bg-gold/5'
                      : theme === 'dark'
                        ? 'border-navy-light/50 bg-navy-light'
                        : 'border-cream-dark bg-cream-dark'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-semibold">{a.area}</h3>
                        <p className={`text-xs mt-0.5 ${
                          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                        }`}>
                          {a.statements?.length || 0} statements
                          {a.progress?.sessions?.length > 0 && (
                            <> &middot; {a.progress.sessions.length} sessions</>
                          )}
                        </p>
                        {a.createdAt && (
                          <p className={`text-[10px] mt-1 ${
                            theme === 'dark' ? 'text-soft-white-dim/50' : 'text-charcoal-light/50'
                          }`}>
                            Created {new Date(a.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {a.id === activeAffirmationId && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full gentle-pulse ${
                          theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                        }`}>
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      {a.id !== activeAffirmationId && (
                        <button
                          onClick={() => handleSetActive(a.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            theme === 'dark'
                              ? 'bg-gold/20 text-gold'
                              : 'bg-gold/20 text-gold-dark'
                          }`}
                        >
                          Set as Active
                        </button>
                      )}
                      <Link
                        to="/discover"
                        className={`px-3 py-1.5 rounded-lg text-xs ${
                          theme === 'dark' ? 'text-soft-white-dim hover:bg-navy' : 'text-charcoal-light hover:bg-cream'
                        }`}
                      >
                        Evolve
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Delete this affirmation?')) {
                            deleteAffirmation(a.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs ${
                          theme === 'dark' ? 'text-red-400/60 hover:text-red-400' : 'text-red-600/60 hover:text-red-600'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Archived */}
          {archived.length > 0 && (
            <div className="space-y-3">
              <p className={`text-xs uppercase tracking-wider ${
                theme === 'dark' ? 'text-soft-white-dim/50' : 'text-charcoal-light/50'
              }`}>
                Archived
              </p>
              {archived.map(a => (
                <div
                  key={a.id}
                  className={`p-3 rounded-xl opacity-60 ${
                    theme === 'dark' ? 'bg-navy-light/50' : 'bg-cream-dark/50'
                  }`}
                >
                  <p className="text-sm font-medium">{a.area}</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                  }`}>
                    {a.statements?.length || 0} statements
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
