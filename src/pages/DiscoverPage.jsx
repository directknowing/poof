import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { DiscoveryProvider, useDiscovery } from '../context/DiscoveryContext';
import { useApp } from '../context/AppContext';
import ScreenArea from '../components/discovery/ScreenArea';
import ScreenMonologue from '../components/discovery/ScreenMonologue';
import ScreenIdentity from '../components/discovery/ScreenIdentity';
import ScreenConfirm from '../components/discovery/ScreenConfirm';
import DirectInterstitial from '../components/DirectInterstitial';
import AffirmationEditor from '../components/AffirmationEditor';
import { generateAffirmationSequence } from '../utils/claude';

function DiscoveryFlow() {
  const navigate = useNavigate();
  const { currentStep, getSummary } = useDiscovery();
  const { apiKey, saveAffirmation, setActiveAffirmation } = useApp();

  // 'discovery' | 'generating' | 'editing'
  const [phase, setPhase] = useState('discovery');
  const [generatedVariations, setGeneratedVariations] = useState(null);
  const [generationDone, setGenerationDone] = useState(false);

  const handleGenerate = useCallback(async () => {
    const summary = getSummary();
    setPhase('generating');
    setGenerationDone(false);

    if (apiKey) {
      try {
        const result = await generateAffirmationSequence(apiKey, summary);
        setGeneratedVariations(result);
        setGenerationDone(true);
      } catch (e) {
        console.error('Generation failed:', e);
        // Create a minimal fallback
        setGeneratedVariations({
          empowered: {
            label: 'Empowered & Direct',
            sections: [
              { type: 'grounding', statements: ['I am here. I am present. I am ready to receive what is true.'] },
              { type: 'release', statements: ['I give myself permission to set down what I\'ve been carrying.'] },
              { type: 'bridge', statements: ['With each breath, I am becoming more of who I already am.'] },
              { type: 'identity', statements: summary.identities.map(id => `I am ${id.toLowerCase()}.`) },
              { type: 'embodiment', statements: ['This is my truth. I carry it in my body. I move through today as this person.'] },
            ],
          },
          gentle: {
            label: 'Gentle & Nurturing',
            sections: [
              { type: 'grounding', statements: ['I am safe here. I am welcome here. I am enough, right now.'] },
              { type: 'release', statements: ['I gently set down what no longer serves the person I\'m becoming.'] },
              { type: 'bridge', statements: ['Little by little, I am opening to a deeper truth about who I am.'] },
              { type: 'identity', statements: summary.identities.map(id => `I am gently becoming ${id.toLowerCase()}.`) },
              { type: 'embodiment', statements: ['I hold this truth gently. It lives in me. I move through today with quiet knowing.'] },
            ],
          },
        });
        setGenerationDone(true);
      }
    } else {
      // No API key — use generic fallback
      const summary2 = getSummary();
      setGeneratedVariations({
        empowered: {
          label: 'Empowered & Direct',
          sections: [
            { type: 'grounding', statements: ['I am here. I am present. I am ready.'] },
            { type: 'release', statements: ['I release what no longer serves me with ease and grace.'] },
            { type: 'bridge', statements: ['With increasing confidence, I step into who I\'m becoming.'] },
            { type: 'identity', statements: summary2.identities.map(id => `I am powerfully becoming ${id.toLowerCase()}.`) },
            { type: 'embodiment', statements: ['This is my truth. I carry it forward.'] },
          ],
        },
        gentle: {
          label: 'Gentle & Nurturing',
          sections: [
            { type: 'grounding', statements: ['I am safe. I am held. I am ready to grow.'] },
            { type: 'release', statements: ['I lovingly set down what I\'ve been carrying.'] },
            { type: 'bridge', statements: ['Little by little, I am becoming who I already am.'] },
            { type: 'identity', statements: summary2.identities.map(id => `I am gently growing into ${id.toLowerCase()}.`) },
            { type: 'embodiment', statements: ['I hold this truth with kindness. I move forward softly.'] },
          ],
        },
      });
      setGenerationDone(true);
    }
  }, [apiKey, getSummary]);

  const handleInterstitialComplete = useCallback(() => {
    setPhase('editing');
  }, []);

  const handleSave = useCallback((statements, variationKey, allVariations) => {
    const summary = getSummary();
    const id = `affirm_${Date.now()}`;
    const affirmation = {
      id,
      area: summary.area?.label || 'General',
      areaId: summary.area?.id,
      statements,
      variationKey,
      variations: allVariations,
      discoveryData: summary,
      createdAt: new Date().toISOString(),
      schedule: null,
      progress: { sessions: [], streak: 0 },
    };
    saveAffirmation(affirmation);
    setActiveAffirmation(id);
    navigate('/practice');
  }, [getSummary, saveAffirmation, setActiveAffirmation, navigate]);

  // D-I-R-E-C-T interstitial phase
  if (phase === 'generating') {
    return (
      <DirectInterstitial
        onComplete={generationDone ? handleInterstitialComplete : null}
      />
    );
  }

  // Affirmation editor phase
  if (phase === 'editing' && generatedVariations) {
    return (
      <PageShell>
        <AffirmationEditor
          variations={generatedVariations}
          summary={getSummary()}
          onSave={handleSave}
        />
      </PageShell>
    );
  }

  // Discovery flow
  const screens = [
    <ScreenArea key="area" />,
    <ScreenMonologue key="monologue" />,
    <ScreenIdentity key="identity" />,
    <ScreenConfirm key="confirm" onGenerate={handleGenerate} />,
  ];

  return (
    <PageShell>
      <div className="pb-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map(step => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'w-8 bg-gold'
                  : step < currentStep
                    ? 'w-1.5 bg-gold/50'
                    : 'w-1.5 bg-gold/20'
              }`}
            />
          ))}
        </div>

        {screens[currentStep]}
      </div>
    </PageShell>
  );
}

export default function DiscoverPage() {
  return (
    <DiscoveryProvider>
      <DiscoveryFlow />
    </DiscoveryProvider>
  );
}
