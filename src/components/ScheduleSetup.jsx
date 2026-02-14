import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import FadeIn from './FadeIn';

const CADENCES = [
  {
    id: 'light',
    label: 'Light / Maintenance',
    frequency: '1x daily (morning)',
    duration: '30 days',
    times: ['08:00'],
    description: 'Good for newer patterns or staying aligned with who you\'re becoming.',
  },
  {
    id: 'standard',
    label: 'Standard',
    frequency: '2x daily (morning + evening)',
    duration: '21 days',
    times: ['08:00', '21:00'],
    description: 'The sweet spot for most people. Morning to set the tone, evening to seal it.',
  },
  {
    id: 'intensive',
    label: 'Intensive',
    frequency: '3x daily',
    duration: '40 days',
    times: ['07:00', '13:00', '21:00'],
    description: 'For deep-rooted patterns. 40 days to fully rewire how you see yourself.',
  },
];

export default function ScheduleSetup({ onSave, recommendedCadence = 'standard' }) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(recommendedCadence);
  const [times, setTimes] = useState(
    CADENCES.find(c => c.id === recommendedCadence)?.times || ['08:00']
  );

  const handleSelect = (id) => {
    setSelected(id);
    setTimes(CADENCES.find(c => c.id === id)?.times || ['08:00']);
  };

  const handleTimeChange = (index, value) => {
    setTimes(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    const cadence = CADENCES.find(c => c.id === selected);
    onSave({
      cadenceId: selected,
      cadenceLabel: cadence.label,
      duration: cadence.duration,
      times,
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <h2 className="font-display text-2xl font-semibold">Your Practice Schedule</h2>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
        }`}>
          Choose a rhythm that fits your life. You can always adjust later.
        </p>
      </FadeIn>

      <div className="space-y-3">
        {CADENCES.map((cadence, i) => (
          <FadeIn key={cadence.id} delay={100 + i * 80}>
            <button
              onClick={() => handleSelect(cadence.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border ${
                selected === cadence.id
                  ? theme === 'dark'
                    ? 'border-gold/60 bg-gold/10'
                    : 'border-gold-dark/40 bg-gold/10'
                  : theme === 'dark'
                    ? 'border-navy-light/50 bg-navy-light/30 hover:border-navy-light'
                    : 'border-cream-dark bg-white/50 hover:border-sage-light/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{cadence.label}</p>
                  <p className={`text-xs mt-0.5 ${
                    theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                  }`}>
                    {cadence.frequency} for {cadence.duration}
                  </p>
                </div>
                {cadence.id === recommendedCadence && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                  }`}>
                    Recommended
                  </span>
                )}
              </div>
              <p className={`text-xs mt-2 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>
                {cadence.description}
              </p>
            </button>
          </FadeIn>
        ))}
      </div>

      {/* Time pickers */}
      <FadeIn delay={400}>
        <div className="space-y-3">
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
          }`}>
            Practice times
          </p>
          {times.map((time, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`text-xs w-16 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>
                {i === 0 ? 'Morning' : i === 1 ? (times.length === 3 ? 'Midday' : 'Evening') : 'Evening'}
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(i, e.target.value)}
                className={`px-3 py-2 rounded-xl text-sm border outline-none ${
                  theme === 'dark'
                    ? 'bg-navy-light border-navy-light/50 text-soft-white'
                    : 'bg-white border-cream-dark text-charcoal'
                }`}
              />
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-gold text-navy-dark hover:bg-gold-light'
              : 'bg-gold-dark text-cream hover:bg-gold'
          } hover:scale-[1.01] active:scale-[0.99]`}
        >
          Set Schedule
        </button>
      </FadeIn>
    </div>
  );
}
