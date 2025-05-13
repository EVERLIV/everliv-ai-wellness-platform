
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";

interface Protocol {
  id: string;
  title: string;
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
}

interface UserProtocolsListProps {
  protocols: Protocol[];
  isLoading: boolean;
  compact?: boolean;
}

const UserProtocolsList = ({ protocols, isLoading, compact = false }: UserProtocolsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-everliv-600" />
      </div>
    );
  }

  if (protocols.length === 0) {
    return (
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600 mb-4">У вас пока нет активных протоколов</p>
          <Link to="/protocols">
            <Button>Добавить протокол</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {protocols.map((protocol) => (
        <Card key={protocol.id} className="overflow-hidden border-gray-200">
          <CardHeader className={`pb-2 ${compact ? 'py-4' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{protocol.title}</CardTitle>
                {!compact && (
                  <CardDescription className="mt-1">{protocol.description}</CardDescription>
                )}
              </div>
              <Link to={`/protocols/${protocol.id}`}>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Прогресс</span>
                <span className="font-medium">{protocol.progress}%</span>
              </div>
              <Progress value={protocol.progress} />
              
              {!compact && (
                <div className="flex justify-between mt-4 text-sm text-gray-500">
                  <span>Начало: {protocol.startDate}</span>
                  <span>Завершение: {protocol.endDate}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {compact && protocols.length > 0 && (
        <div className="text-center mt-4">
          <Link to="/my-protocols">
            <Button variant="outline">Смотреть все протоколы</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProtocolsList;
