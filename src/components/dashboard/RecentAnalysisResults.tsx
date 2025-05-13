
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { AnalysisRecord } from "@/hooks/useAnalysisHistory";

interface RecentAnalysisResultsProps {
  results: AnalysisRecord[];
  isLoading: boolean;
}

const RecentAnalysisResults = ({ results, isLoading }: RecentAnalysisResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[150px] w-full rounded-md" />
        <Skeleton className="h-[150px] w-full rounded-md" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500">У вас пока нет результатов анализов</p>
          <button className="mt-4 text-sm text-primary hover:underline">
            Загрузить результаты анализов
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium">{result.analysis_type}</h3>
                <Badge 
                  variant={
                    result.results?.status === "normal" ? "outline" : 
                    result.results?.status === "warning" ? "secondary" : "destructive"
                  }
                >
                  {result.results?.status === "normal" ? "Норма" : 
                   result.results?.status === "warning" ? "Внимание" : "Критично"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(result.created_at).toLocaleDateString('ru-RU')}
              </p>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {result.results?.indicators.slice(0, 3).map((indicator, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{indicator.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        indicator.status === "normal" ? "text-green-600" :
                        indicator.status === "low" ? "text-amber-600" : "text-red-600"
                      }`}>
                        {indicator.value} {indicator.unit}
                      </span>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          indicator.status === "normal" ? "border-green-200 text-green-600" :
                          indicator.status === "low" ? "border-amber-200 text-amber-600" : "border-red-200 text-red-600"
                        }`}
                      >
                        {indicator.status === "normal" ? "N" : 
                         indicator.status === "low" ? "L" : "H"}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {result.results?.indicators.length > 3 && (
                  <p className="text-xs text-gray-500 mt-2">
                    +{result.results.indicators.length - 3} еще показателей
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 flex justify-center">
              <button className="text-sm text-primary hover:underline">
                Посмотреть полный отчет
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center">
        <button className="text-sm text-primary hover:underline">
          Смотреть все результаты
        </button>
      </div>
    </div>
  );
};

export default RecentAnalysisResults;
