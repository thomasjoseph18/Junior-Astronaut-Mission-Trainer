export type NavTab = 'home' | 'missions' | 'journal' | 'settings';

export type Destination = 'moon' | 'mars';

export interface MissionInfo {
  id: Destination;
  name: string;
  tagline: string;
  location: string;
  era: string;
  gravity: string;
  dayLength: string;
  atmosphere: string;
  tempRange: string;
  targetSols: number;
  primaryObjective: string;
  historyNote: string;
  cadetLevel: string;
  colorScheme: {
    primary: string;
    border: string;
    glow: string;
    badge: string;
  };
}

export interface SolTelemetry {
  currentSol: number;
  totalSols: number;
  oxygenLevel: number;
  waterLevel: number;
  powerLevel: number;
  habitatTempC: number;
  habitatIntegrity: number;
  statusMessage: string;
}

export interface JournalEntry {
  id: string;
  sol: number;
  title: string;
  author: string;
  timestamp: string;
  body: string;
  badge?: {
    name: string;
    icon: string;
    description: string;
  };
  scienceTip: string;
}

export interface SettingsConfig {
  callSign: string;
  audioEnabled: boolean;
  novaVoiceEnabled: boolean;
  textSize: 'normal' | 'large';
  lowPerformanceMode: boolean;
}
