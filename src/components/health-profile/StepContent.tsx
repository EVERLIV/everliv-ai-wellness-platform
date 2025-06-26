
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StepContentProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const StepContent: React.FC<StepContentProps> = ({
  title,
  subtitle,
  icon: Icon,
  children
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {subtitle}
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepContent;
