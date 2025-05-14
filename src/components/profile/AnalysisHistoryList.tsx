
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { AnalysisRecord } from "@/hooks/useAnalysisHistory";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

interface AnalysisHistoryListProps {
  history: AnalysisRecord[];
  isLoading: boolean;
}

const AnalysisHistoryList = ({ history, isLoading }: AnalysisHistoryListProps) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">Загрузка истории анализов...</div>;
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">У вас пока нет сохраненных анализов</h3>
          <p className="text-gray-500">Здесь будет отображаться история ваших анализов</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">История анализов</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Тип анализа</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {format(new Date(record.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                </TableCell>
                <TableCell>{record.analysis_type}</TableCell>
                <TableCell>{record.results?.status || "Завершен"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Просмотр <ArrowRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistoryList;
