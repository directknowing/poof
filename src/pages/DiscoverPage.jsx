import PageShell from '../components/PageShell';
import { DiscoveryProvider, useDiscovery } from '../context/DiscoveryContext';
import ScreenArea from '../components/discovery/ScreenArea';
import ScreenMonologue from '../components/discovery/ScreenMonologue';
import ScreenIdentity from '../components/discovery/ScreenIdentity';
import ScreenConfirm from '../components/discovery/ScreenConfirm';

function DiscoveryFlow() {
  const { currentStep } = useDiscovery();

  const screens = [
    <ScreenArea key="area" />,
    <ScreenMonologue key="monologue" />,
    <ScreenIdentity key="identity" />,
    <ScreenConfirm key="confirm" />,
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
