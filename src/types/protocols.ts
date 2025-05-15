
import { UserProtocol as DbUserProtocol } from './database';

// Protocol-related types that aren't directly tied to database tables

// User protocol type for the My Protocols page
export type UserProtocol = DbUserProtocol;

// Protocol type for the useProtocolData hook
export type Protocol = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: string;
  status: string;
  benefits: string[];
  steps: string[];
  completion_percentage: number;
  started_at: string | null;
};
