import { useTheme } from '../context/ThemeContext';

export default function PageShell({ children, className = '', noPadding = false }) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen pb-20 page-transition transition-colors duration-300 ${
      theme === 'dark' ? 'bg-navy text-soft-white' : 'bg-cream text-charcoal'
    } ${noPadding ? '' : 'px-4 pt-6'} ${className}`}>
      <div className={noPadding ? '' : 'max-w-lg mx-auto'}>
        {children}
      </div>
    </div>
  );
}
