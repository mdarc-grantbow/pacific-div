import { createContext, useContext } from 'react';

export interface Conference {
  id: string;
  name: string;
  year: number;
  location: string;
  startDate: string;
  endDate: string;
  slug: string;
  isActive: boolean;
  // Branding (optional)
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
}

interface ConferenceContextType {
  currentConference: Conference | null;
  setCurrentConference: (conference: Conference | null | undefined) => void;
}

export const ConferenceContext = createContext<ConferenceContextType | undefined>(undefined);

export const DEFAULT_CONFERENCE: Conference = {
  id: 'pacificon-2025',
  name: 'Pacificon',
  year: 2025,
  location: 'San Francisco, CA',
  startDate: '2025-10-10',
  endDate: '2025-10-12',
  slug: 'pacificon-2025',
  isActive: true,
};

export function useConference() {
  const context = useContext(ConferenceContext);
  if (!context) {
    throw new Error('useConference must be used within ConferenceProvider');
  }
  return context;
}
