import { createContext, useContext } from 'react';

export interface Conference {
  id: string;
  name: string;
  year: number;
  location: string;
  startDate: string;
  endDate: string;
  timezone: string;
  slug: string;
  division: string;
  gridSquare: string;
  gps: string;
  locationAddress: string;
  directionsHtml?: string;
  isActive: boolean;
  // Branding (optional)
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
}

interface ConferenceContextType {
  currentConference: Conference | null;
  setCurrentConference: (conference: Conference | null) => void;
}

interface ConferencesListContextType {
  conferencesList: Conference[] | null;
  setConferencesList: (conferencesList: Conference[] | null) => void;
}

//console.log(isUndefined(default_conference));

//const DEFAULT_CONFERENCE = createContext<ConferenceContextType>({

//// do not understand why: Cannot find name 'DEFAULT_CONFERENCE'. ts(2304) 
const DEFAULT_CONFERENCE: Conference = {
  id: 'pacificon-2025',
  name: 'Pacificon',
  year: 2025,
  location: 'San Ramon, CA',
  startDate: '2025-10-10',
  endDate: '2025-10-12',
  timezone: 'America/Los_Angeles',
  slug: 'pacificon-2025',
  division: 'Pacific',
  isActive: true,
  gridSquare: 'CM87us',
  gps: '37.7629351,-121.9674592',
  locationAddress: '2600 Bishop Drive, San Ramon, CA 94583',
  // Branding
  logoUrl: "https://raw.githubusercontent.com/pacificon/example-assets/main/pacificon-logo.png",
  faviconUrl: "/favicon-pacificon.ico",
  primaryColor: "#1e40af",
  accentColor: "#f97316",
};

export function useConference() {
  const context = useContext(ConferenceContext);
  if (!context) {
    throw new Error('useConference must be used within ConferenceProvider');
    //export const ConferenceContext = createContext<ConferenceContextType | undefined>(undefined);


    //setCurrentConference(DEFAULT_CONFERENCE);
    //setConferencesList([DEFAULT_CONFERENCE]);
    //const { data: conferences = [] } = useQuery<Conference[]>({
    //  queryKey: ['/api/conferences'],
    //});

    //return {
    //  id: 'pacificon-2025',
    //  name: 'Pacificon',
    ///  year: 2025,
    //  location: 'San Ramon, CA',
    //  startDate: '2025-10-10',
    //  endDate: '2025-10-12',
    //  slug: 'pacificon-2025',
    //  division: 'Pacific',
    //  isActive: true,
    //  gridSquare: 'CM87us',
    //  gps: '37.7629351,-121.9674592',
    //  locationAddress: '2600 Bishop Drive, San Ramon, CA 94583',
    //  // Branding
    //  logoUrl: '',
    //  faviconUrl: '',
    //  primaryColor: '',
    //  accentColor: '',
    //};
  }
  return context;
}

export function useConferencesList() {
  const context = useContext(ConferencesListContext);
  if (!context) {
    throw new Error('useConferencesList must be used within ConferenceProvider');
  }
  return context;
}

export const ConferenceContext = createContext<ConferenceContextType>({
  currentConference: DEFAULT_CONFERENCE,
  setCurrentConference: useConference,
});

export const ConferencesListContext = createContext<ConferencesListContextType>({
  conferencesList: [DEFAULT_CONFERENCE],
  setConferencesList: useConferencesList,
});

export function useConferenceContext() {
  return useContext(ConferenceContext);
}

export function useConferencesListContext() {
  return useContext(ConferencesListContext);
}
