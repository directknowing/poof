import { createContext, useContext, useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(() => getItem('api_key', ''));
  const [affirmations, setAffirmationsState] = useState(() => getItem('affirmations', []));
  const [activeAffirmationId, setActiveAffirmationId] = useState(() => getItem('active_affirmation_id', null));

  const setApiKey = useCallback((key) => {
    setApiKeyState(key);
    setItem('api_key', key);
  }, []);

  const saveAffirmation = useCallback((affirmation) => {
    setAffirmationsState(prev => {
      const existing = prev.findIndex(a => a.id === affirmation.id);
      let next;
      if (existing >= 0) {
        next = [...prev];
        next[existing] = affirmation;
      } else {
        next = [...prev, affirmation];
      }
      setItem('affirmations', next);
      return next;
    });
  }, []);

  const deleteAffirmation = useCallback((id) => {
    setAffirmationsState(prev => {
      const next = prev.filter(a => a.id !== id);
      setItem('affirmations', next);
      return next;
    });
    if (activeAffirmationId === id) {
      setActiveAffirmationId(null);
      setItem('active_affirmation_id', null);
    }
  }, [activeAffirmationId]);

  const setActiveAffirmation = useCallback((id) => {
    setActiveAffirmationId(id);
    setItem('active_affirmation_id', id);
  }, []);

  const activeAffirmation = affirmations.find(a => a.id === activeAffirmationId) || null;

  return (
    <AppContext.Provider value={{
      apiKey,
      setApiKey,
      affirmations,
      saveAffirmation,
      deleteAffirmation,
      activeAffirmationId,
      activeAffirmation,
      setActiveAffirmation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
