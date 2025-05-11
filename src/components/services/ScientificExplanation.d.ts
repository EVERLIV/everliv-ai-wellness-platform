
export interface ScientificExplanationProps {
  summary: string;
  mechanisms: {
    title: string;
    description: React.ReactNode;
  }[];
  visualComponent?: React.ReactNode;
  references: {
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
    url?: string;
  }[];
  category?: string;
  researchData?: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    summary: string;
  }[];
}
