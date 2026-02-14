import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { exportAllData, importAllData } from '../utils/storage';
import { requestNotificationPermission, getNotificationStatus } from '../utils/notifications';
import PageShell from '../components/PageShell';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { apiKey, setApiKey } = useApp();
  const [notifStatus, setNotifStatus] = useState(getNotificationStatus());
  const [showAbout, setShowAbout] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleRequestNotifications = async () => {
    const result = await requestNotificationPermission();
    setNotifStatus(result);
  };

  const handleExport = () => {
    const data = exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affirm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        importAllData(data);
        setImportMessage('Data imported successfully. Refresh the page to see changes.');
      } catch {
        setImportMessage('Failed to import — invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <PageShell>
      <h1 className="font-display text-3xl font-semibold mb-6">Settings</h1>
      <div className="space-y-4">
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

        {/* Notifications */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className={`text-xs mt-0.5 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>
                {notifStatus === 'granted'
                  ? 'Enabled'
                  : notifStatus === 'denied'
                    ? 'Blocked by browser'
                    : notifStatus === 'unsupported'
                      ? 'Not supported'
                      : 'Not enabled'}
              </p>
            </div>
            {notifStatus !== 'granted' && notifStatus !== 'unsupported' && (
              <button
                onClick={handleRequestNotifications}
                className={`text-xs px-3 py-1.5 rounded-lg ${
                  theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                }`}
              >
                Enable
              </button>
            )}
          </div>
          <p className={`text-xs mt-2 ${
            theme === 'dark' ? 'text-soft-white-dim/60' : 'text-charcoal-light/60'
          }`}>
            Reminders will say &quot;Your affirmation practice is ready&quot; — never the content itself.
          </p>
        </div>

        {/* Data Management */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <p className="text-sm font-medium mb-3">Data</p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium border ${
                theme === 'dark'
                  ? 'border-navy-light/50 text-soft-white-dim hover:border-gold/30'
                  : 'border-cream-dark text-charcoal-light hover:border-gold-dark/30'
              }`}
            >
              Export JSON
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium border ${
                theme === 'dark'
                  ? 'border-navy-light/50 text-soft-white-dim hover:border-gold/30'
                  : 'border-cream-dark text-charcoal-light hover:border-gold-dark/30'
              }`}
            >
              Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          {importMessage && (
            <p className={`text-xs mt-2 ${
              importMessage.includes('success')
                ? 'text-sage-dark'
                : 'text-amber-600'
            }`}>
              {importMessage}
            </p>
          )}
          <p className={`text-xs mt-2 ${
            theme === 'dark' ? 'text-soft-white-dim/60' : 'text-charcoal-light/60'
          }`}>
            Export creates a full backup of all affirmations, progress, and recordings.
          </p>
        </div>

        {/* About */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
        }`}>
          <button
            onClick={() => setShowAbout(s => !s)}
            className="w-full flex items-center justify-between"
          >
            <p className="text-sm font-medium">About Affirm</p>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-4 h-4 transition-transform ${showAbout ? 'rotate-180' : ''} ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {showAbout && (
            <div className={`mt-3 space-y-3 text-xs ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>
              <p>
                Affirm is a personal affirmation companion that uses the D-I-R-E-C-T framework
                to create practices with real psychological and energetic integrity.
              </p>
              <div className="space-y-2">
                <p className="font-medium text-sm" style={{ color: 'inherit' }}>
                  The D-I-R-E-C-T Framework
                </p>
                <div className="space-y-1.5">
                  <p><strong>D &mdash; Declare:</strong> Present tense. &ldquo;I am,&rdquo; not &ldquo;I will be.&rdquo;</p>
                  <p><strong>I &mdash; Identity:</strong> Who you&apos;re becoming, not what you&apos;re getting.</p>
                  <p><strong>R &mdash; Rising Trajectory:</strong> Language of expansion — &ldquo;more and more,&rdquo; &ldquo;increasingly.&rdquo;</p>
                  <p><strong>E &mdash; Emotionally Charged:</strong> Every statement needs at least one feeling-word.</p>
                  <p><strong>C &mdash; Concise:</strong> One breath per statement. Mantra-like.</p>
                  <p><strong>T &mdash; True North:</strong> Nothing your mind will fight. Trajectory over absolutes.</p>
                </div>
              </div>
              <p>
                All data is stored locally on your device. The only external connection
                is to Anthropic&apos;s API when generating affirmations.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
