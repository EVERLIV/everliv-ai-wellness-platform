
import React from "react";
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminUser } from "@/services/admin-service";
import { CreditCard } from "lucide-react";

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  selectedPlanType: string;
  setSelectedPlanType: (planType: string) => void;
  expiryDate: string;
  setExpiryDate: (date: string) => void;
  processing: boolean;
  onAssignSubscription: () => Promise<void>;
}

const SubscriptionDialog = ({
  isOpen,
  onClose,
  user,
  selectedPlanType,
  setSelectedPlanType,
  expiryDate,
  setExpiryDate,
  processing,
  onAssignSubscription,
}: SubscriptionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Управление подпиской</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Пользователь</Label>
              <p className="text-sm font-medium">
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user.email}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="planType">Тарифный план</Label>
              <Select value={selectedPlanType} onValueChange={setSelectedPlanType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тарифный план" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Базовый</SelectItem>
                  <SelectItem value="standard">Стандарт</SelectItem>
                  <SelectItem value="premium">Премиум</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Дата окончания</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="expiryDate" 
                  type="date" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setExpiryDate(nextMonth.toISOString().split('T')[0]);
                  }}
                  title="1 месяц от текущей даты"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {user.subscription_status === 'active' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                У пользователя уже есть активная подписка ({user.subscription_type}).
                При назначении новой подписки, текущая будет автоматически отменена.
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button 
            onClick={onAssignSubscription}
            disabled={processing || !selectedPlanType || !expiryDate}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {processing ? "Обработка..." : "Назначить подписку"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
