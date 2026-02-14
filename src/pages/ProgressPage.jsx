import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import PageShell from '../components/PageShell';

export default function ProgressPage() {
  const { theme } = useTheme();
  const { activeAffirmation } = useApp();

  return (
    <PageShell>
      <h1 className="font-display text-3xl font-semibold mb-6">Progress</h1>
      {!activeAffirmation ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className={`text-base ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            Start a practice to track your progress.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl text-center ${
            theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
          }`}>
            <p className={`text-sm mb-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>Current Streak</p>
            <p className="font-display text-5xl font-bold text-gold">0</p>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>days</p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
