
import React from "react";
import { CardContent } from "@/components/ui/card";

const HealthSummaryLoading: React.FC = () => {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="text-center">
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default HealthSummaryLoading;
