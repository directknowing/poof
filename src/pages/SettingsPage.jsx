import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import PageShell from '../components/PageShell';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { apiKey, setApiKey } = useApp();

  return (
    <PageShell>
      <h1 className="font-display text-3xl font-semibold mb-6">Settings</h1>
      <div className="space-y-6">
        {/* API Key */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <label className="block text-sm font-medium mb-2">Claude API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className={`w-full px-3 py-2.5 rounded-xl text-sm border transition-colors ${
              theme === 'dark'
                ? 'bg-navy border-navy-light/50 text-soft-white placeholder-soft-white-dim/50 focus:border-gold/50'
                : 'bg-cream border-cream-dark text-charcoal placeholder-charcoal-light/50 focus:border-gold/50'
            } outline-none`}
          />
          <p className={`text-xs mt-2 ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            Get your key from{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-dark underline underline-offset-2"
            >
              console.anthropic.com
            </a>
            . Your key is stored locally and never sent to any server except Anthropic&apos;s API.
          </p>
        </div>

        {/* Theme Toggle */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className={`text-xs mt-0.5 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                theme === 'dark' ? 'bg-gold' : 'bg-sage-light'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <p className="text-sm font-medium mb-1">About Affirm</p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            A personal affirmation companion using the D-I-R-E-C-T framework
            to create practices with real psychological and energetic integrity.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
