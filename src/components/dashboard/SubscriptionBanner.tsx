
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionBanner = () => {
  const { subscription, isLoading } = useSubscription();

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-everliv-600" />
          <div>
            <h2 className="font-medium">Состояние подписки</h2>
            {isLoading ? (
              <Skeleton className="h-5 w-32 mt-1" />
            ) : subscription ? (
              <div className="flex items-center mt-1">
                <span
                  className={`text-sm ${
                    subscription.status === "active"
                      ? "text-evergreen-600"
                      : "text-yellow-600"
                  }`}
                >
                  {subscription.plan_type === "basic"
                    ? "Базовый"
                    : subscription.plan_type === "standard"
                    ? "Стандарт"
                    : "Премиум"}{" "}
                  ({subscription.status === "active" ? "Активна" : "Отменена"})
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500 mt-1">
                Нет активной подписки
              </span>
            )}
          </div>
        </div>
        <Link to="/subscription">
          <Button>
            {subscription ? "Управление подпиской" : "Оформить подписку"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
