
import React from "react";
import { User, Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PatientHeaderProps {
  patientName: string;
  patientId: string;
  lastCheckup: string;
}

const PatientHeader = ({ patientName, patientId, lastCheckup }: PatientHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 my-[20px]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="text-blue-600 h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patientName}</h1>
              <p className="text-gray-500">ID: {patientId} • Последний визит: {lastCheckup}</p>
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
    </div>
  );
};

export default PatientHeader;
