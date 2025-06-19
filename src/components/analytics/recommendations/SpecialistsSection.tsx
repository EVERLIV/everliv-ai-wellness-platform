
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";

interface Specialist {
  id: string;
  specialist: string;
  reason: string;
  urgency: 'immediate' | 'routine';
  estimatedCost: string;
  frequency: string;
}

interface SpecialistsSectionProps {
  specialists: Specialist[];
}

const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({ specialists }) => {
  if (specialists.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">Консультации специалистов</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialists.map((specialist) => (
          <Card key={specialist.id} className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">{specialist.specialist}</CardTitle>
                </div>
                <Badge className={`text-xs ${specialist.urgency === 'immediate' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {specialist.urgency === 'immediate' ? 'Срочно' : 'Плановый'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 mb-2">{specialist.reason}</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Стоимость:</strong> {specialist.estimatedCost}</div>
                <div><strong>Частота:</strong> {specialist.frequency}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SpecialistsSection;
