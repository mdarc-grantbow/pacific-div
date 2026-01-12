import { createContext, useContext, ReactNode } from 'react';

export interface Conference {
  id: string;
  name: string;
  year: number;
  location: string;
  startDate: string;
  endDate: string;
  slug: string;
  isActive: boolean;
}

interface ConferenceContextType {
  currentConference: Conference | null;
  setCurrentConference: (conference: Conference) => void;
}

export const ConferenceContext = createContext<ConferenceContextType | undefined>(undefined);

export function useConference() {
  const context = useContext(ConferenceContext);
  if (!context) {
    throw new Error('useConference must be used within ConferenceProvider');
  }
  return context;
}
