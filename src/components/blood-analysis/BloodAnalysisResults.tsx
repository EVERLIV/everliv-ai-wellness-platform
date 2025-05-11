
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface BloodMarker {
  name: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  recommendation: string;
}

interface Supplement {
  name: string;
  reason: string;
  dosage: string;
}

interface BloodAnalysisResultsProps {
  results: {
    markers: BloodMarker[];
    supplements: Supplement[];
    generalRecommendation: string;
  } | null;
  isAnalyzing: boolean;
  onBack: () => void;
}

const BloodAnalysisResults = ({ results, isAnalyzing, onBack }: BloodAnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Анализ биомаркеров</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Показатель</TableHead>
              <TableHead>Значение</TableHead>
              <TableHead>Норма</TableHead>
              <TableHead>Рекомендация</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.markers.map((marker) => (
              <TableRow key={marker.name}>
                <TableCell>{marker.name}</TableCell>
                <TableCell className={`font-medium ${marker.status === 'high' ? 'text-red-500' : marker.status === 'low' ? 'text-amber-500' : 'text-green-500'}`}>
                  {marker.value}
                </TableCell>
                <TableCell className="text-gray-500">{marker.normalRange}</TableCell>
                <TableCell>{marker.recommendation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Рекомендуемые добавки</h3>
        <ul className="space-y-3">
          {results.supplements.map((supplement) => (
            <li key={supplement.name} className="flex items-start gap-2">
              <div className="min-w-4 mt-1">•</div>
              <div>
                <span className="font-medium">{supplement.name}</span> — {supplement.reason}
                <div className="text-sm text-gray-600 mt-1">Дозировка: {supplement.dosage}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Общие рекомендации</h3>
        <p className="text-gray-700">{results.generalRecommendation}</p>
      </div>

      <div className="pt-4">
        <Button variant="outline" onClick={onBack}>
          Вернуться к вводу данных
        </Button>
      </div>
    </div>
  );
};

export default BloodAnalysisResults;
