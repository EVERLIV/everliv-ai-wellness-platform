
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
  category?: string; // Add category support for backward compatibility
  researchData?: { // Add researchData support for backward compatibility
    title: string;
    authors: string;
    year: number;
    journal: string;
    summary: string;
  }[];
}
