
import React from "react";
import { BookOpen } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Appointment {
  type: string;
  status: string;
  date: string;
}

interface AppointmentsCardProps {
  appointments: Appointment[];
}

const AppointmentsCard = ({ appointments }: AppointmentsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
          Предстоящие визиты
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {appointments.map((appointment, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">{appointment.type}</span>
                <span className={
                  appointment.status === "Подтверждено" 
                    ? "text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full" 
                    : "text-yellow-600 text-xs bg-yellow-50 px-2 py-0.5 rounded-full"
                }>
                  {appointment.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{appointment.date}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" className="text-blue-600">
            Управление визитами
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsCard;
