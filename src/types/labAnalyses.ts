
export interface AnalysisItem {
  id: string;
  analysis_type: string;
  created_at: string;
  summary: string;
  markers_count: number;
  input_method: 'text' | 'photo';
  results?: any;
}

export interface AnalysisStatistics {
  totalAnalyses: number;
  currentMonthAnalyses: number;
  mostRecentAnalysis: string | null;
  analysisTypes: { [key: string]: number };
}
