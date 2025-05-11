
import React from "react";
import { Activity } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VitalSign {
  label: string;
  value: string;
}

interface VitalSignsCardProps {
  vitalSigns: {
    weight: string;
    height: string;
    bmi: string;
    bloodPressure: string;
    heartRate: string;
  };
}

const VitalSignsCard = ({ vitalSigns }: VitalSignsCardProps) => {
  const vitalSignsList: VitalSign[] = [
    { label: "Вес", value: vitalSigns.weight },
    { label: "Рост", value: vitalSigns.height },
    { label: "ИМТ", value: vitalSigns.bmi },
    { label: "Артериальное давление", value: vitalSigns.bloodPressure },
    { label: "Пульс", value: vitalSigns.heartRate },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Показатели
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {vitalSignsList.map((sign, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-500">{sign.label}</span>
              <span className="font-medium">{sign.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" className="text-blue-600">
            Показать всю историю
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignsCard;
