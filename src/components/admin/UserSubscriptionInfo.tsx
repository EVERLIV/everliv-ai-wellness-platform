
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface UserSubscriptionInfoProps {
  subscription: {
    plan_type: string;
    status: string;
    started_at: string;
    expires_at: string;
  } | null;
  isLoading: boolean;
}

const UserSubscriptionInfo = ({ subscription, isLoading }: UserSubscriptionInfoProps) => {
  // Получаем название плана на русском
  const getPlanName = (planType: string) => {
    switch(planType) {
      case 'basic': return 'Базовый';
      case 'standard': return 'Стандарт';
      case 'premium': return 'Премиум';
      default: return planType;
    }
  };

  // Получаем статус подписки на русском
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Активна';
      case 'canceled': return 'Отменена';
      case 'expired': return 'Истекла';
      default: return status;
    }
  };

  // Получаем цвет статуса подписки
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-amber-100 text-amber-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Загрузка данных о подписке...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Информация о подписке</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">У пользователя нет активной подписки</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Информация о подписке</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Тарифный план:</span>
          <Badge variant="outline" className="font-medium">{getPlanName(subscription.plan_type)}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Статус:</span>
          <Badge className={`${getStatusColor(subscription.status)}`}>{getStatusLabel(subscription.status)}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Дата начала:</span>
          <span>{format(new Date(subscription.started_at), 'dd.MM.yyyy')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Дата окончания:</span>
          <span>{format(new Date(subscription.expires_at), 'dd.MM.yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSubscriptionInfo;
