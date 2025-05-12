import React from "react";
import { User, Printer, ArrowLeft, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
interface PatientHeaderProps {
  patientName: string;
  patientId: string;
  lastCheckup: string;
}
const PatientHeader = ({
  patientName,
  patientId,
  lastCheckup
}: PatientHeaderProps) => {
  const {
    subscription
  } = useSubscription();
  const getPlanBadgeColor = (planType?: string) => {
    switch (planType) {
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'standard':
        return 'bg-everliv-100 text-everliv-800';
      case 'premium':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="bg-white border-b border-gray-200 my-[20px]">
      <div className="container mx-auto px-4 my-0 py-[60px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="text-blue-600 h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patientName}</h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-500">ID: {patientId} • Последний визит: {lastCheckup}</p>
                {subscription && <Badge className={`${getPlanBadgeColor(subscription.plan_type)} flex items-center gap-1`}>
                    <Crown className="h-3 w-3" /> 
                    План: {subscription.plan_type === 'basic' ? 'Базовый' : subscription.plan_type === 'standard' ? 'Стандарт' : 'Премиум'}
                  </Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Печать
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default PatientHeader;