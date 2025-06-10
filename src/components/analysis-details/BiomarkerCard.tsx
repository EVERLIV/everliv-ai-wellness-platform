
import React from "react";
import { Biomarker } from "@/types/analysis";
import BiomarkerStatus from "./BiomarkerStatus";

interface BiomarkerCardProps {
  biomarker: Biomarker;
}

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({ biomarker }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow print:p-3 print:border-gray-300 print:rounded-none print:hover:shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {/* Название показателя */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-900 text-sm print:text-xs">
            {biomarker.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 print:hidden">
            {biomarker.description}
          </p>
        </div>

        {/* Значение */}
        <div className="md:col-span-1">
          <p className="text-xs font-medium text-gray-700 mb-1 print:text-xs">Значение</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-bold text-gray-900 print:text-sm">
              {biomarker.value}
            </span>
            {biomarker.unit && (
              <span className="text-xs text-gray-600 print:text-xs">{biomarker.unit}</span>
            )}
          </div>
        </div>

        {/* Норма */}
        <div className="md:col-span-1">
          <p className="text-xs font-medium text-gray-700 mb-1">Норма</p>
          <p className="text-sm text-gray-600 print:text-xs">{biomarker.referenceRange}</p>
        </div>

        {/* Статус */}
        <div className="md:col-span-1">
          <p className="text-xs font-medium text-gray-700 mb-1">Статус</p>
          <BiomarkerStatus status={biomarker.status} />
        </div>
      </div>
    </div>
  );
};

export default BiomarkerCard;
