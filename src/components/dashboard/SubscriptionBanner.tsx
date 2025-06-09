
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionBanner = () => {
  const { subscription, isLoading } = useSubscription();

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-amber-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-amber-600" />
          <div>
            <h2 className="font-medium text-amber-900">Премиум аккаунт</h2>
            {isLoading ? (
              <Skeleton className="h-5 w-32 mt-1" />
            ) : (
              <div className="flex items-center mt-1">
                <span className="text-sm text-amber-700">
                  Полный доступ ко всем функциям EVERLIV
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
            ПРЕМИУМ
          </div>
          <Link to="/dashboard/subscription">
            <Button variant="outline" size="sm">
              Управление
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
