
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  id: string;
  date: string;
  type: string;
  status: 'normal' | 'warning' | 'critical';
  indicators: {
    name: string;
    value: string;
    unit: string;
    status: 'normal' | 'low' | 'high';
  }[];
}

interface RecentAnalysisResultsProps {
  results: AnalysisResult[];
  isLoading: boolean;
}

const RecentAnalysisResults = ({ results, isLoading }: RecentAnalysisResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-everliv-600" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600 mb-4">У вас пока нет результатов анализов</p>
          <Link to="/blood-analysis">
            <Button>Загрузить анализы</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{result.type}</CardTitle>
            <CardDescription>{result.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.indicators.slice(0, 3).map((indicator, index) => (
                <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                  <span className="text-sm">{indicator.name}</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      indicator.status === 'normal' 
                        ? 'text-green-600' 
                        : indicator.status === 'low' 
                        ? 'text-amber-600' 
                        : 'text-red-600'
                    }`}>
                      {indicator.value} {indicator.unit}
                    </span>
                  </div>
                </div>
              ))}
              
              {result.indicators.length > 3 && (
                <div className="text-xs text-gray-500 text-right mt-1">
                  + еще {result.indicators.length - 3} показателей
                </div>
              )}
              
              <div className="mt-3">
                <Link to={`/blood-analysis/${result.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Просмотреть полный отчет
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center mt-4">
        <Link to="/blood-analysis">
          <Button variant="outline">История всех анализов</Button>
        </Link>
      </div>
    </div>
  );
};

export default RecentAnalysisResults;
