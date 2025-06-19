
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield } from "lucide-react";

interface RiskFactor {
  id: string;
  factor: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  currentImpact: string;
  monitoringFrequency: string;
}

interface RiskFactorsProps {
  riskFactors: RiskFactor[];
}

const RiskFactors: React.FC<RiskFactorsProps> = ({ riskFactors }) => {
  const getRiskLevelColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
    }
  };

  if (riskFactors.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-6 w-6 text-amber-600" />
        <h2 className="text-xl font-semibold text-gray-900">Факторы риска</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskFactors.map((risk) => (
          <Card key={risk.id} className={`border-2 ${getRiskLevelColor(risk.level)} hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    risk.level === 'high' ? 'bg-red-100' : risk.level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <Shield className={`h-4 w-4 ${
                      risk.level === 'high' ? 'text-red-600' : risk.level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`} />
                  </div>
                  <CardTitle className="text-sm font-medium">{risk.factor}</CardTitle>
                </div>
                <Badge className={getRiskLevelColor(risk.level)}>
                  {risk.level === 'high' ? 'Высокий' : risk.level === 'medium' ? 'Средний' : 'Низкий'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
              <p className="text-xs text-gray-600 mb-3">{risk.currentImpact}</p>
              <div className="text-xs text-gray-600">
                <strong>Мониторинг:</strong> {risk.monitoringFrequency}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RiskFactors;
