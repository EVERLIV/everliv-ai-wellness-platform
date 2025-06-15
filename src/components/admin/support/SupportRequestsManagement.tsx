
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { SupportRequest } from "@/types/support";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Star, 
  Bug, 
  MessageSquare, 
  Lightbulb,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle 
} from "lucide-react";
import SupportRequestDialog from "./SupportRequestDialog";

const SupportRequestsManagement = () => {
  const { getSupportRequests } = useSupportRequests();
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: requests = [], isLoading } = getSupportRequests;

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'rating': return <Star className="h-4 w-4" />;
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'feature': return <Lightbulb className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Открыт
        </Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          В работе
        </Badge>;
      case 'resolved':
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Решен
        </Badge>;
      case 'closed':
        return <Badge variant="outline" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Закрыт
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Срочно</Badge>;
      case 'high':
        return <Badge variant="secondary">Высокий</Badge>;
      case 'normal':
        return <Badge variant="outline">Обычный</Badge>;
      case 'low':
        return <Badge variant="outline">Низкий</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' || request.status === filterStatus
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          Все ({requests.length})
        </Button>
        <Button
          variant={filterStatus === 'open' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('open')}
        >
          Открытые ({requests.filter(r => r.status === 'open').length})
        </Button>
        <Button
          variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('in_progress')}
        >
          В работе ({requests.filter(r => r.status === 'in_progress').length})
        </Button>
        <Button
          variant={filterStatus === 'resolved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('resolved')}
        >
          Решенные ({requests.filter(r => r.status === 'resolved').length})
        </Button>
      </div>

      {/* Список запросов */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRequestIcon(request.request_type)}
                  <CardTitle className="text-lg">{request.subject}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(request.priority)}
                  {getStatusBadge(request.status)}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{request.user_name}</span>
                <span>{request.user_email}</span>
                <span>{format(new Date(request.created_at), 'dd MMM yyyy, HH:mm', { locale: ru })}</span>
                {request.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {request.rating}/10
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 mb-3 line-clamp-2">{request.message}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Тип: {request.request_type === 'rating' ? 'Оценка' : 
                        request.request_type === 'bug' ? 'Баг' : 
                        request.request_type === 'feature' ? 'Новая функция' : 'Вопрос'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequest(request)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Обращений не найдено
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? 'Пока не поступило ни одного обращения в поддержку.'
                : `Нет обращений со статусом "${filterStatus}".`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Диалог с деталями запроса */}
      {selectedRequest && (
        <SupportRequestDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default SupportRequestsManagement;
