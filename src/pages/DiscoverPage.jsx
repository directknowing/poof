import PageShell from '../components/PageShell';
import { useTheme } from '../context/ThemeContext';

export default function DiscoverPage() {
  const { theme } = useTheme();

  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="font-display text-3xl font-semibold mb-3">Discovery</h1>
        <p className={`text-base ${
          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
        }`}>
          The excavation flow will be built in Step 2.
        </p>
      </div>
    </PageShell>
  );
}
