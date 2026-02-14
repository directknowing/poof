import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { checkDirectPrinciples, generateAffirmationSequence } from '../utils/claude';
import FadeIn from './FadeIn';

const SECTION_LABELS = {
  grounding: 'Grounding',
  release: 'Release',
  bridge: 'Bridge',
  identity: 'Identity',
  embodiment: 'Embodiment',
};

const DIRECT_LETTERS = ['D', 'I', 'R', 'E', 'C', 'T'];

function StatementCard({ statement, index, theme, onEdit, onCheck, apiKey }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(statement);
  const [checkResult, setCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleSave = () => {
    onEdit(index, editValue);
    setIsEditing(false);
    setCheckResult(null);
  };

  const handleCheck = async () => {
    if (!apiKey) return;
    setIsChecking(true);
    try {
      const result = await checkDirectPrinciples(apiKey, statement);
      setCheckResult(result);
    } catch (e) {
      console.error('D-I-R-E-C-T check failed:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleApplySuggestion = () => {
    if (checkResult?.suggestion) {
      onEdit(index, checkResult.suggestion);
      setEditValue(checkResult.suggestion);
      setCheckResult(null);
    }
  };

  return (
    <div className={`p-3 rounded-xl border ${
      theme === 'dark' ? 'border-navy-light/40 bg-navy-light/20' : 'border-cream-dark/60 bg-white/40'
    }`}>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none ${
              theme === 'dark'
                ? 'bg-navy border-navy-light/50 text-soft-white'
                : 'bg-cream border-cream-dark text-charcoal'
            }`}
            rows={2}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                theme === 'dark' ? 'bg-gold text-navy-dark' : 'bg-gold-dark text-cream'
              }`}
            >
              Save
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditValue(statement); }}
              className={`px-3 py-1.5 rounded-lg text-xs ${
                theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-display text-base leading-relaxed">{statement}</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => { setIsEditing(true); setEditValue(statement); }}
              className={`text-xs px-2 py-1 rounded-md ${
                theme === 'dark' ? 'text-soft-white-dim hover:bg-navy-light/50' : 'text-charcoal-light hover:bg-cream-dark/50'
              }`}
            >
              Edit
            </button>
            {apiKey && (
              <button
                onClick={handleCheck}
                disabled={isChecking}
                className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${
                  theme === 'dark' ? 'text-gold hover:bg-gold/10' : 'text-gold-dark hover:bg-gold/10'
                } ${isChecking ? 'opacity-50' : ''}`}
              >
                {isChecking ? (
                  <span className="w-3 h-3 border border-gold/30 border-t-gold rounded-full animate-spin inline-block" />
                ) : null}
                D-I-R-E-C-T Check
              </button>
            )}
          </div>

          {/* D-I-R-E-C-T Check Results */}
          {checkResult && (
            <div className={`mt-3 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-navy/60' : 'bg-cream/60'
            }`}>
              <div className="flex gap-1 mb-2">
                {DIRECT_LETTERS.map(letter => {
                  const rating = checkResult.ratings?.[letter];
                  return (
                    <div
                      key={letter}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                        rating?.pass
                          ? 'bg-sage/30 text-sage-dark'
                          : 'bg-amber-500/20 text-amber-600'
                      }`}
                      title={rating?.note || ''}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
              {checkResult.suggestion && (
                <div className="mt-2">
                  <p className={`text-xs mb-1 ${
                    theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                  }`}>Suggested improvement:</p>
                  <p className="text-sm font-display italic">{checkResult.suggestion}</p>
                  <button
                    onClick={handleApplySuggestion}
                    className={`mt-1.5 text-xs px-2 py-1 rounded-md ${
                      theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                    }`}
                  >
                    Apply suggestion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AffirmationEditor({ variations, summary, onSave, onRegenerate }) {
  const { theme } = useTheme();
  const { apiKey } = useApp();
  const [selectedVariation, setSelectedVariation] = useState('empowered');
  const [editedVariations, setEditedVariations] = useState(variations);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateNotes, setRegenerateNotes] = useState('');
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);

  const currentVariation = editedVariations[selectedVariation];
  const allStatements = currentVariation?.sections?.flatMap(s => s.statements) || [];

  const handleEditStatement = (flatIndex, newValue) => {
    setEditedVariations(prev => {
      const next = { ...prev };
      const variation = { ...next[selectedVariation] };
      const sections = variation.sections.map(s => ({ ...s, statements: [...s.statements] }));

      let count = 0;
      for (const section of sections) {
        for (let i = 0; i < section.statements.length; i++) {
          if (count === flatIndex) {
            section.statements[i] = newValue;
            variation.sections = sections;
            next[selectedVariation] = variation;
            return next;
          }
          count++;
        }
      }
      return prev;
    });
  };

  const handleRegenerate = async () => {
    if (!apiKey) return;
    setIsRegenerating(true);
    try {
      const result = await generateAffirmationSequence(apiKey, summary);
      setEditedVariations(result);
      setShowRegenerateInput(false);
      setRegenerateNotes('');
    } catch (e) {
      console.error('Regeneration failed:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = () => {
    onSave(allStatements, selectedVariation, editedVariations);
  };

  let statementIndex = 0;

  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <h1 className="font-display text-3xl font-semibold">Your Affirmation</h1>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
        }`}>
          {summary.area?.label} — {allStatements.length} statements
        </p>
      </FadeIn>

      {/* Variation Toggle */}
      <FadeIn delay={100}>
        <div className={`flex rounded-xl p-1 ${
          theme === 'dark' ? 'bg-navy-light/50' : 'bg-cream-dark/50'
        }`}>
          {Object.entries(editedVariations).map(([key, v]) => (
            <button
              key={key}
              onClick={() => setSelectedVariation(key)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                selectedVariation === key
                  ? theme === 'dark'
                    ? 'bg-navy-light text-gold'
                    : 'bg-white text-gold-dark shadow-sm'
                  : theme === 'dark'
                    ? 'text-soft-white-dim'
                    : 'text-charcoal-light'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Statements by section */}
      {currentVariation?.sections?.map((section, si) => (
        <FadeIn key={si} delay={200 + si * 100}>
          <div className="space-y-2">
            <p className={`text-xs uppercase tracking-wider font-medium ${
              theme === 'dark' ? 'text-gold/70' : 'text-gold-dark/70'
            }`}>
              {SECTION_LABELS[section.type] || section.type}
            </p>
            {section.statements.map((stmt) => {
              const idx = statementIndex++;
              return (
                <StatementCard
                  key={`${selectedVariation}-${idx}`}
                  statement={stmt}
                  index={idx}
                  theme={theme}
                  onEdit={handleEditStatement}
                  apiKey={apiKey}
                />
              );
            })}
          </div>
        </FadeIn>
      ))}

      {/* Actions */}
      <FadeIn delay={400}>
        <div className="space-y-3 pt-4">
          {/* Regenerate */}
          {apiKey && (
            <div>
              {!showRegenerateInput ? (
                <button
                  onClick={() => setShowRegenerateInput(true)}
                  disabled={isRegenerating}
                  className={`w-full py-3 rounded-2xl text-sm transition-all border ${
                    theme === 'dark'
                      ? 'border-navy-light text-soft-white-dim hover:border-gold/30'
                      : 'border-cream-dark text-charcoal-light hover:border-gold-dark/30'
                  } ${isRegenerating ? 'opacity-50' : ''}`}
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate with notes'}
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={regenerateNotes}
                    onChange={(e) => setRegenerateNotes(e.target.value)}
                    placeholder="What would you like adjusted? (optional)"
                    className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none ${
                      theme === 'dark'
                        ? 'bg-navy-light/30 border-navy-light/50 text-soft-white placeholder-soft-white-dim/40'
                        : 'bg-white/50 border-cream-dark text-charcoal placeholder-charcoal-light/40'
                    }`}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${
                        theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                      } ${isRegenerating ? 'opacity-50' : ''}`}
                    >
                      {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                    </button>
                    <button
                      onClick={() => { setShowRegenerateInput(false); setRegenerateNotes(''); }}
                      className={`px-4 py-2.5 rounded-xl text-sm ${
                        theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gold text-navy-dark hover:bg-gold-light'
                : 'bg-gold-dark text-cream hover:bg-gold'
            } hover:scale-[1.01] active:scale-[0.99]`}
          >
            Lock In This Practice
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
