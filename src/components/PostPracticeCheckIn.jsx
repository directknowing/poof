import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const FEELINGS = [
  { emoji: '😐', label: 'Going through the motions', value: 1 },
  { emoji: '🙂', label: 'Felt something', value: 2 },
  { emoji: '😌', label: 'Present and grounded', value: 3 },
  { emoji: '✨', label: 'Really resonated', value: 4 },
  { emoji: '🔥', label: 'Fully felt it', value: 5 },
];

export default function PostPracticeCheckIn({ onComplete }) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(null);

  const handleSelect = (feeling) => {
    setSelected(feeling.value);
    setTimeout(() => onComplete(feeling.value), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm page-transition">
      <div className={`w-full max-w-sm p-6 rounded-3xl ${
        theme === 'dark' ? 'bg-navy' : 'bg-cream'
      } shadow-xl`}>
        <p className="font-display text-xl font-semibold text-center mb-1">
          How did that feel?
        </p>
        <p className={`text-xs text-center mb-6 ${
          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
        }`}>
          For your own awareness only. No judgment.
        </p>

        <div className="space-y-2">
          {FEELINGS.map((feeling) => (
            <button
              key={feeling.value}
              onClick={() => handleSelect(feeling)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                selected === feeling.value
                  ? theme === 'dark'
                    ? 'border-gold/60 bg-gold/10 scale-[1.02]'
                    : 'border-gold-dark/40 bg-gold/10 scale-[1.02]'
                  : theme === 'dark'
                    ? 'border-navy-light/50 bg-navy-light/20 hover:border-navy-light'
                    : 'border-cream-dark bg-white/50 hover:border-sage-light/50'
              }`}
            >
              <span className="text-xl">{feeling.emoji}</span>
              <span className="text-sm">{feeling.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
