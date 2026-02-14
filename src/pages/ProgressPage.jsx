import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import PageShell from '../components/PageShell';
import FadeIn from '../components/FadeIn';

const MILESTONES = [
  { days: 7, message: 'One week in. The new story is taking root.' },
  { days: 21, message: '21 days. A new habit is forming. This is real.' },
  { days: 40, message: '40 days. Deep rewiring complete. You\'ve transformed.' },
];

function CalendarView({ sessions, theme }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  const sessionDates = new Set(
    sessions.map(s => (s.date || '').split('T')[0])
  );

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasSession = sessionDates.has(dateStr);
    const isToday = d === today.getDate();

    days.push(
      <div
        key={d}
        className={`aspect-square flex items-center justify-center rounded-full text-xs relative ${
          isToday
            ? theme === 'dark' ? 'ring-1 ring-gold/50' : 'ring-1 ring-gold-dark/30'
            : ''
        }`}
      >
        <span className={
          hasSession
            ? theme === 'dark' ? 'text-soft-white' : 'text-charcoal'
            : theme === 'dark' ? 'text-soft-white-dim/40' : 'text-charcoal-light/40'
        }>
          {d}
        </span>
        {hasSession && (
          <div className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${
            theme === 'dark' ? 'bg-gold' : 'bg-gold-dark'
          }`} />
        )}
      </div>
    );
  }

  return (
    <div>
      <p className={`text-sm font-medium mb-3 ${
        theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
      }`}>
        {monthName}
      </p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className={`text-center text-[10px] ${
            theme === 'dark' ? 'text-soft-white-dim/40' : 'text-charcoal-light/40'
          }`}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { theme } = useTheme();
  const { activeAffirmation } = useApp();

  const sessions = activeAffirmation?.progress?.sessions || [];
  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    const dates = [...new Set(sessions.map(s => (s.date || '').split('T')[0]))].sort().reverse();

    let count = 0;
    let checkDate = new Date(today);

    for (const date of dates) {
      const expected = checkDate.toISOString().split('T')[0];
      if (date === expected) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (date < expected) {
        break;
      }
    }
    return count;
  }, [sessions]);

  const totalSessions = sessions.length;
  const avgFeeling = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + (s.feeling || 3), 0) / sessions.length).toFixed(1)
    : '\u2014';

  const nextMilestone = MILESTONES.find(m => m.days > streak) || MILESTONES[MILESTONES.length - 1];
  const reachedMilestones = MILESTONES.filter(m => streak >= m.days);

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
          {/* Streak counter */}
          <FadeIn>
            <div className={`p-6 rounded-2xl text-center ${
              theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
            }`}>
              <p className={`text-sm mb-1 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>Current Streak</p>
              <p className="font-display text-5xl font-bold text-gold">{streak}</p>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}>
                {streak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={100}>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl text-center ${
                theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
              }`}>
                <p className="font-display text-2xl font-bold">{totalSessions}</p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                }`}>Total Sessions</p>
              </div>
              <div className={`p-4 rounded-2xl text-center ${
                theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
              }`}>
                <p className="font-display text-2xl font-bold">{avgFeeling}</p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                }`}>Avg Feeling</p>
              </div>
            </div>
          </FadeIn>

          {/* Calendar */}
          <FadeIn delay={200}>
            <div className={`p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-navy-light' : 'bg-cream-dark'
            }`}>
              <CalendarView sessions={sessions} theme={theme} />
            </div>
          </FadeIn>

          {/* Next milestone */}
          {streak < 40 && (
            <FadeIn delay={300}>
              <div className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'border-gold/20 bg-gold/5' : 'border-gold-dark/15 bg-gold/5'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gold' : 'text-gold-dark'
                }`}>
                  Next milestone: Day {nextMilestone.days}
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-gold/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${Math.min(100, (streak / nextMilestone.days) * 100)}%` }}
                  />
                </div>
                <p className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                }`}>
                  {nextMilestone.days - streak} {nextMilestone.days - streak === 1 ? 'day' : 'days'} to go
                </p>
              </div>
            </FadeIn>
          )}

          {/* Reached milestones */}
          {reachedMilestones.length > 0 && (
            <FadeIn delay={400}>
              <div className="space-y-2">
                <p className={`text-xs uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gold/70' : 'text-gold-dark/70'
                }`}>
                  Milestones Reached
                </p>
                {reachedMilestones.map(m => (
                  <div key={m.days} className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-navy-light/50' : 'bg-cream-dark/50'
                  }`}>
                    <p className="text-sm font-medium">Day {m.days}</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                    }`}>{m.message}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      )}
    </PageShell>
  );
}
