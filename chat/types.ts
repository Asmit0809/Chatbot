
export enum Role {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  sources?: { uri: string; title: string }[];
}

export interface ThreatUpdate {
  name: string;
  mechanism: string;
  symptoms: string[];
  prevention: string[];
}
