
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportRequest } from "@/types/support";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Star, User, Mail, Calendar, MessageSquare } from "lucide-react";

interface SupportRequestDialogProps {
  request: SupportRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportRequestDialog = ({ request, open, onOpenChange }: SupportRequestDialogProps) => {
  const { updateSupportRequest } = useSupportRequests();
  const [status, setStatus] = useState(request.status);
  const [priority, setPriority] = useState(request.priority);
  const [adminNotes, setAdminNotes] = useState(request.admin_notes || '');

  const handleSave = async () => {
    const updates: Partial<SupportRequest> = {
      status,
      priority,
      admin_notes: adminNotes,
    };

    if (status === 'resolved' && request.status !== 'resolved') {
      updates.resolved_at = new Date().toISOString();
    }

    await updateSupportRequest.mutateAsync({ id: request.id, updates });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Обращение #{request.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{request.user_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{request.user_email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(request.created_at), 'dd MMM yyyy, HH:mm', { locale: ru })}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Тип: </span>
                <Badge variant="outline">
                  {request.request_type === 'rating' ? 'Оценка' : 
                   request.request_type === 'bug' ? 'Баг' : 
                   request.request_type === 'feature' ? 'Новая функция' : 'Вопрос'}
                </Badge>
              </div>
              {request.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Оценка: </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{request.rating}/10</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Тема */}
          <div>
            <h3 className="font-medium mb-2">Тема</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.subject}</p>
          </div>

          {/* Сообщение */}
          <div>
            <h3 className="font-medium mb-2">Сообщение</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">{request.message}</p>
          </div>

          {/* Дополнительные поля */}
          {request.problem_type && (
            <div>
              <h3 className="font-medium mb-2">Тип проблемы</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.problem_type}</p>
            </div>
          )}

          {request.browser_info && (
            <div>
              <h3 className="font-medium mb-2">Информация о браузере</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.browser_info}</p>
            </div>
          )}

          {request.rating_comment && (
            <div>
              <h3 className="font-medium mb-2">Комментарий к оценке</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.rating_comment}</p>
            </div>
          )}

          {/* Управление статусом */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Статус</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Открыт</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="resolved">Решен</SelectItem>
                  <SelectItem value="closed">Закрыт</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Приоритет</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="normal">Обычный</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="urgent">Срочно</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Заметки админа */}
          <div>
            <label className="text-sm font-medium mb-2 block">Заметки администратора</label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Добавьте заметки для команды..."
              rows={3}
            />
          </div>

          {/* Действия */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateSupportRequest.isPending}
            >
              {updateSupportRequest.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportRequestDialog;
