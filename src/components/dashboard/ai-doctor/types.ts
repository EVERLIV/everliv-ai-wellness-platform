
import { ReactNode } from 'react';

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type SuggestedQuestion = {
  text: string;
  icon: string;
};
