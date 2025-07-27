import { withErrorHandling } from '@/utils/errorHandler';

interface BiomarkerAnalysisRequest {
  biomarkers: Array<{
    name: string;
    value: string;
    reference_range?: string;
    status?: string;
  }>;
  userProfile?: any;
}

interface BiomarkerAnalysisResponse {
  analysis: string;
  recommendations: string[];
  riskFactors: string[];
  error?: string;
}

// Fallback analysis when OpenAI API is unavailable
const generateFallbackAnalysis = (biomarkers: BiomarkerAnalysisRequest['biomarkers']): BiomarkerAnalysisResponse => {
  const criticalBiomarkers = biomarkers.filter(b => 
    b.status?.toLowerCase().includes('critical') ||
    b.status?.toLowerCase().includes('high') ||
    b.status?.toLowerCase().includes('elevated')
  );

  const analysis = criticalBiomarkers.length > 0 
    ? `Обнаружены отклонения в ${criticalBiomarkers.length} биомаркерах. Рекомендуется консультация с врачом для детального анализа.`
    : 'Большинство биомаркеров в пределах нормы. Продолжайте придерживаться здорового образа жизни.';

  const recommendations = criticalBiomarkers.length > 0
    ? [
        'Обратитесь к врачу для интерпретации результатов',
        'Следите за питанием и физической активностью',
        'Повторите анализы через 1-3 месяца',
        'Рассмотрите консультацию со специалистом'
      ]
    : [
        'Поддерживайте здоровый образ жизни',
        'Регулярно проходите профилактические обследования',
        'Следите за сбалансированным питанием',
        'Поддерживайте физическую активность'
      ];

  const riskFactors = criticalBiomarkers.length > 0
    ? criticalBiomarkers.map(b => `Отклонение в ${b.name}`)
    : ['Риски не выявлены'];

  return {
    analysis,
    recommendations,
    riskFactors
  };
};

export const analyzeBiomarkersWithFallback = withErrorHandling(
  async (data: BiomarkerAnalysisRequest): Promise<BiomarkerAnalysisResponse> => {
    try {
      // Try OpenAI API first
      const response = await fetch('/api/analyze-biomarkers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('OpenAI API unavailable, using fallback analysis:', error);
      // Return fallback analysis
      return generateFallbackAnalysis(data.biomarkers);
    }
  },
  'biomarker analysis'
);