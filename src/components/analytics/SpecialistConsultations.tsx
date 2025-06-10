
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

interface SpecialistConsultation {
  id: string;
  specialist: string;
  urgency: string;
  reason: string;
  purpose: string;
  preparation: string;
}

interface SpecialistConsultationsProps {
  consultations: SpecialistConsultation[];
}

const SpecialistConsultations: React.FC<SpecialistConsultationsProps> = ({ consultations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-green-500" />
          Рекомендуемые консультации специалистов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="border border-green-200 bg-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">{consultation.specialist}</h4>
                  <p className="text-sm text-green-700 mb-2">{consultation.reason}</p>
                  <p className="text-xs text-green-600">
                    <strong>Срочность:</strong> {consultation.urgency}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Цель:</strong> {consultation.purpose}
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Подготовка:</strong> {consultation.preparation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialistConsultations;
