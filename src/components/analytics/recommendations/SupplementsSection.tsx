
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  cost: string;
  benefit: string;
}

interface SupplementsSectionProps {
  supplements: Supplement[];
}

const SupplementsSection: React.FC<SupplementsSectionProps> = ({ supplements }) => {
  if (supplements.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Pill className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Рекомендованные добавки</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supplements.map((supplement) => (
          <Card key={supplement.id} className="border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Pill className="h-4 w-4 text-green-600" />
                </div>
                <CardTitle className="text-sm font-medium">{supplement.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="text-xs text-gray-600">
                <strong>Дозировка:</strong> {supplement.dosage}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Время:</strong> {supplement.timing}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Стоимость:</strong> {supplement.cost}
              </div>
              <p className="text-sm text-gray-700">{supplement.benefit}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SupplementsSection;
