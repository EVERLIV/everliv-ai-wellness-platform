
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { biomarkersData } from "@/data/biomarkers";

interface BiomMarkersListProps {
  onSelectBiomarker: (id: string) => void;
  selectedBiomarker: string | null;
}

const BiomArkersList: React.FC<BiomMarkersListProps> = ({ 
  onSelectBiomarker, 
  selectedBiomarker 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-blue-600';
      case 'normal':
        return 'text-green-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'high':
        return 'bg-blue-50 border-blue-200';
      case 'normal':
        return 'bg-green-50 border-green-200';
      case 'low':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-0">
          {Object.entries(biomarkersData).map(([key, biomarker]) => (
            <div
              key={key}
              className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedBiomarker === key ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectBiomarker(key)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  biomarker.status === 'high' ? 'bg-blue-500' : 
                  biomarker.status === 'normal' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-gray-900">{biomarker.nameRu}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`font-medium ${getStatusColor(biomarker.status)}`}>
                  {biomarker.currentValue} {biomarker.unit}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                >
                  Норма
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomArkersList;
