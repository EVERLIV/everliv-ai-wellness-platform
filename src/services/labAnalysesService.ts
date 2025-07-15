
import { supabase } from "@/integrations/supabase/client";
import { AnalysisItem } from "@/types/labAnalyses";
import { parseAnalysisResults, isValidUUID } from "@/utils/labAnalysesUtils";

export const labAnalysesService = {
  async fetchAnalysesData(userId: string) {
    console.log('🔍 labAnalysesService: Querying medical_analyses table...');
    const { data: analysesData, error: analysesError } = await supabase
      .from('medical_analyses')
      .select(`
        id, 
        analysis_type, 
        created_at, 
        test_date,
        summary, 
        input_method,
        results
      `)
      .eq('user_id', userId)
      .order('test_date', { ascending: false });

    if (analysesError) {
      console.error('❌ labAnalysesService: Error fetching analyses:', analysesError);
      throw analysesError;
    }

    return analysesData || [];
  },

  async fetchBiomarkersData(analysisIds: string[]) {
    console.log('🔍 labAnalysesService: Fetching biomarkers for analysis IDs:', analysisIds);
    
    const { data: biomarkerData, error: biomarkerError } = await supabase
      .from('biomarkers')
      .select('analysis_id')
      .in('analysis_id', analysisIds);

    if (biomarkerError) {
      console.error('⚠️ labAnalysesService: Error fetching biomarkers:', biomarkerError);
      return [];
    }

    return biomarkerData || [];
  },

  formatAnalysisData(analysesData: any[], biomarkerCounts: { [key: string]: number }): AnalysisItem[] {
    return analysesData.map(item => {
      const markersCount = biomarkerCounts[item.id] || 0;
      
      // Safely parse results
      const parsedResults = parseAnalysisResults(item.results);
      
      // Try to get markers count from results if no biomarkers in separate table
      let finalMarkersCount = markersCount;
      if (markersCount === 0 && parsedResults?.markers && Array.isArray(parsedResults.markers)) {
        finalMarkersCount = parsedResults.markers.length;
      }

      console.log(`📋 labAnalysesService: Analysis ${item.id}:`, {
        type: item.analysis_type,
        created: item.created_at,
        testDate: item.test_date,
        biomarkersFromTable: markersCount,
        biomarkersFromResults: parsedResults?.markers?.length || 0,
        finalCount: finalMarkersCount
      });

      return {
        id: item.id,
        analysis_type: item.analysis_type,
        created_at: item.test_date || item.created_at, // Используем дату анализа, а не создания записи
        summary: item.summary || '',
        markers_count: finalMarkersCount,
        input_method: (item.input_method as 'text' | 'photo') || 'text',
        results: parsedResults
      };
    });
  }
};
