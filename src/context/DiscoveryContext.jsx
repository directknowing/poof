import { createContext, useContext, useState, useCallback } from 'react';

const DiscoveryContext = createContext();

const LIFE_AREAS = [
  { id: 'money-career', label: 'Money & Career', subtext: 'How you earn, build, and relate to abundance' },
  { id: 'relationships', label: 'Relationships & Love', subtext: 'How you connect, trust, and let people in' },
  { id: 'health-body', label: 'Health & Body', subtext: 'How you inhabit and care for your physical self' },
  { id: 'confidence', label: 'Confidence & Self-Worth', subtext: 'How you see yourself when no one\'s watching' },
  { id: 'purpose', label: 'Purpose & Direction', subtext: 'Knowing what you\'re here for and moving toward it' },
  { id: 'peace', label: 'Peace & Emotional Balance', subtext: 'Your inner climate — calm, chaos, or somewhere between' },
  { id: 'creativity', label: 'Creativity & Expression', subtext: 'Your ability to make, share, and put yourself out there' },
];

// Placeholder sub-options per area (will be replaced by API in Step 3)
const PLACEHOLDER_SUB_OPTIONS = {
  'money-career': [
    "I'm stuck or plateaued",
    "I don't trust myself to make the right moves",
    "I work hard but it doesn't translate to results",
    "I have a complicated relationship with money itself",
    "I know what I want but can't get momentum",
  ],
  'relationships': [
    "I keep attracting the same patterns",
    "I struggle to let people truly see me",
    "I give too much and lose myself",
    "I have walls up that I can't seem to lower",
    "I want deep connection but fear vulnerability",
  ],
  'health-body': [
    "I know what to do but can't stay consistent",
    "I have a complicated relationship with my body image",
    "I'm carrying stress in my body",
    "I neglect myself while taking care of everyone else",
    "I feel disconnected from my physical self",
  ],
  'confidence': [
    "I constantly compare myself to others",
    "I shrink in certain situations",
    "My inner critic runs the show",
    "I need external validation to feel okay",
    "I know I'm capable but can't seem to own it",
  ],
  'purpose': [
    "I feel like I'm drifting without clear direction",
    "I have too many interests and can't commit to one path",
    "I know what I want but fear going after it",
    "I feel like I'm running out of time",
    "I'm stuck between what's safe and what calls to me",
  ],
  'peace': [
    "My mind won't quiet down",
    "I carry anxiety that doesn't match my actual circumstances",
    "I react to things more intensely than I want to",
    "I struggle to be present — always in the past or future",
    "I feel overwhelmed by emotions I can't name",
  ],
  'creativity': [
    "I have ideas but never follow through",
    "I'm terrified of being judged",
    "I used to be creative but lost touch with it",
    "Perfectionism stops me before I start",
    "I don't trust my creative instincts",
  ],
};

// Placeholder inner monologue (will be replaced by API in Step 3)
const PLACEHOLDER_MONOLOGUES = {
  'money-career': [
    "I always second-guess myself and then the moment passes",
    "Other people seem to just know what to do — I'm always figuring it out",
    "What if I go all in and it doesn't work?",
    "I'm capable but something keeps me playing small",
    "I don't have the right background / connections / credentials",
  ],
  'relationships': [
    "Everyone eventually leaves or disappoints me",
    "I don't know how to need people without losing myself",
    "Maybe I'm just not the kind of person people stay for",
    "I want to open up but something always stops me",
    "I feel like I'm too much or never enough",
  ],
  'health-body': [
    "I'll start Monday... again",
    "My body feels like a project that's never finished",
    "I know better but I can't seem to do better",
    "Other people seem to handle this effortlessly",
    "I don't deserve to feel good until I've earned it",
  ],
  'confidence': [
    "Who am I to think I can do this?",
    "If people really knew me, they wouldn't be impressed",
    "I'm one mistake away from everyone seeing through me",
    "I keep waiting until I'm ready, but that day never comes",
    "I make myself small so I don't make others uncomfortable",
  ],
  'purpose': [
    "I should have figured this out by now",
    "Maybe I don't have a purpose — maybe that's just for special people",
    "I keep starting over and never arriving anywhere",
    "What if I pick the wrong thing and waste more time?",
    "Everyone else seems to have a clear path",
  ],
  'peace': [
    "I can't remember the last time I felt truly calm",
    "Even when things are fine, I'm waiting for the other shoe to drop",
    "I feel everything so deeply it's exhausting",
    "I should be over this by now",
    "I don't know how to just... be",
  ],
  'creativity': [
    "What's the point if it's not going to be good enough?",
    "I have all these ideas but none of them are original",
    "People will think I'm being self-indulgent",
    "I'll do it when I have more time / space / money",
    "The world doesn't need another person trying to be creative",
  ],
};

// Placeholder identity statements (will be replaced by API in Step 3)
const PLACEHOLDER_IDENTITIES = {
  'money-career': [
    "Someone who backs themselves without needing a guarantee",
    "A person who moves decisively and trusts the process",
    "Someone whose confidence comes from within, not from external proof",
    "A person who builds boldly and recovers quickly",
    "Someone who knows their value without needing to prove it",
    "A person who creates abundance naturally through aligned action",
  ],
  'relationships': [
    "Someone who lets people in without losing themselves",
    "A person who attracts love that matches their depth",
    "Someone who sets boundaries with grace, not guilt",
    "A person whose vulnerability is their greatest strength",
    "Someone who trusts their heart to know who's safe",
    "A person who receives love as naturally as they give it",
  ],
  'health-body': [
    "Someone who cares for their body as an act of love, not punishment",
    "A person whose healthy choices feel natural, not forced",
    "Someone who listens to their body's wisdom",
    "A person who moves through life feeling strong and alive",
    "Someone who is at home in their own skin",
    "A person who treats rest as just as important as action",
  ],
  'confidence': [
    "Someone who takes up space without apology",
    "A person whose self-worth isn't up for debate",
    "Someone who speaks their truth even when their voice shakes",
    "A person who celebrates others without diminishing themselves",
    "Someone who walks into any room knowing they belong",
    "A person who leads with quiet, unshakeable self-trust",
  ],
  'purpose': [
    "Someone who moves toward what calls them, even without a map",
    "A person who trusts that their path is unfolding perfectly",
    "Someone who creates meaning through action, not overthinking",
    "A person who turns their gifts into real impact",
    "Someone who chooses commitment over perfection",
    "A person who knows that starting is more important than knowing",
  ],
  'peace': [
    "Someone who can sit in stillness without needing to escape",
    "A person whose inner world feels spacious and calm",
    "Someone who processes emotions without being consumed by them",
    "A person who trusts themselves to handle whatever comes",
    "Someone who has made peace with uncertainty",
    "A person who responds to life rather than reacting to it",
  ],
  'creativity': [
    "Someone who creates freely without waiting for permission",
    "A person who trusts their creative voice completely",
    "Someone who shares their work without needing it to be perfect",
    "A person who sees creativity as essential, not optional",
    "Someone who finishes what they start and lets it be enough",
    "A person who creates for the joy of it, not the validation",
  ],
};

export function DiscoveryProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0); // 0=area, 1=monologue, 2=identity, 3=confirm
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSubOptions, setSelectedSubOptions] = useState([]);
  const [customSubOption, setCustomSubOption] = useState('');
  const [selectedMonologues, setSelectedMonologues] = useState([]);
  const [selectedIdentities, setSelectedIdentities] = useState([]);
  const [customIdentity, setCustomIdentity] = useState('');
  const [subOptions, setSubOptions] = useState([]);
  const [monologues, setMonologues] = useState([]);
  const [identities, setIdentities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectArea = useCallback((area) => {
    setSelectedArea(area);
    // Load placeholder sub-options
    setSubOptions(PLACEHOLDER_SUB_OPTIONS[area.id] || []);
  }, []);

  const confirmSubOptions = useCallback(() => {
    const areaId = selectedArea?.id;
    if (!areaId) return;
    // Load placeholder monologues
    setMonologues(PLACEHOLDER_MONOLOGUES[areaId] || []);
    setCurrentStep(1);
  }, [selectedArea]);

  const confirmMonologues = useCallback(() => {
    const areaId = selectedArea?.id;
    if (!areaId) return;
    // Load placeholder identities
    setIdentities(PLACEHOLDER_IDENTITIES[areaId] || []);
    setCurrentStep(2);
  }, [selectedArea]);

  const confirmIdentities = useCallback(() => {
    setCurrentStep(3);
  }, []);

  const goBack = useCallback(() => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setSelectedMonologues([]);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setSelectedSubOptions([]);
      setCustomSubOption('');
      setCurrentStep(0);
      setSubOptions([]);
      setSelectedArea(null);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setSelectedArea(null);
    setSelectedSubOptions([]);
    setCustomSubOption('');
    setSelectedMonologues([]);
    setSelectedIdentities([]);
    setCustomIdentity('');
    setSubOptions([]);
    setMonologues([]);
    setIdentities([]);
    setIsLoading(false);
  }, []);

  const getSummary = useCallback(() => ({
    area: selectedArea,
    subOptions: selectedSubOptions,
    customSubOption,
    monologues: selectedMonologues,
    identities: selectedIdentities,
    customIdentity,
  }), [selectedArea, selectedSubOptions, customSubOption, selectedMonologues, selectedIdentities, customIdentity]);

  return (
    <DiscoveryContext.Provider value={{
      currentStep,
      setCurrentStep,
      selectedArea,
      selectArea,
      selectedSubOptions,
      setSelectedSubOptions,
      customSubOption,
      setCustomSubOption,
      subOptions,
      setSubOptions,
      confirmSubOptions,
      monologues,
      setMonologues,
      selectedMonologues,
      setSelectedMonologues,
      confirmMonologues,
      identities,
      setIdentities,
      selectedIdentities,
      setSelectedIdentities,
      customIdentity,
      setCustomIdentity,
      confirmIdentities,
      goBack,
      reset,
      getSummary,
      isLoading,
      setIsLoading,
      lifeAreas: LIFE_AREAS,
    }}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) throw new Error('useDiscovery must be used within DiscoveryProvider');
  return context;
}
