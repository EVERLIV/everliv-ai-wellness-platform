
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertTriangle, Target, CheckCircle2, Activity } from "lucide-react";

interface RecommendedTest {
  id: string;
  name: string;
  frequency: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  includes: string[];
}

interface RecommendedTestsProps {
  tests: RecommendedTest[];
}

const RecommendedTests: React.FC<RecommendedTestsProps> = ({ tests }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Рекомендуемые медицинские обследования
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-purple-900">{test.name}</h4>
                {getPriorityIcon(test.priority)}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-purple-800">
                  <strong>Частота:</strong> {test.frequency}
                </p>
                <p className="text-sm text-purple-700">{test.reason}</p>
                
                <div>
                  <p className="text-xs font-medium text-purple-800 mb-1">Включает:</p>
                  <ul className="text-xs text-purple-700">
                    {test.includes.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTests;
