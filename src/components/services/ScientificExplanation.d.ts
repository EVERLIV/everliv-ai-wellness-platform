
export interface ScientificExplanationProps {
  category: string;
  researchData: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    summary: string;
  }[];
}
