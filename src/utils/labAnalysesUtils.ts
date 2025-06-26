
// Helper function to safely parse results
export const parseAnalysisResults = (results: any) => {
  if (!results) return null;
  
  // If results is already an object, return it
  if (typeof results === 'object' && results !== null) {
    return results;
  }
  
  // If results is a string, try to parse it as JSON
  if (typeof results === 'string') {
    try {
      return JSON.parse(results);
    } catch (error) {
      console.warn('Failed to parse results as JSON:', error);
      return null;
    }
  }
  
  return null;
};

// Helper function to validate UUID format
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Helper function to calculate analysis statistics
export const calculateAnalysisStatistics = (formattedData: any[]) => {
  const totalAnalyses = formattedData.length;
  
  // Calculate analyses for current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthAnalyses = formattedData.filter(
    item => new Date(item.created_at) >= firstDayOfMonth
  ).length;

  // Get most recent analysis date
  const mostRecentAnalysis = formattedData.length > 0 
    ? formattedData[0].created_at 
    : null;

  // Count analysis types
  const analysisTypes: { [key: string]: number } = {};
  formattedData.forEach(item => {
    analysisTypes[item.analysis_type] = (analysisTypes[item.analysis_type] || 0) + 1;
  });

  return {
    totalAnalyses,
    currentMonthAnalyses,
    mostRecentAnalysis,
    analysisTypes
  };
};
