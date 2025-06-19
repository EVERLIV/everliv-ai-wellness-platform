
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube } from "lucide-react";

interface Test {
  id: string;
  testName: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  frequency: string;
  expectedCost: string;
  whereToGet: string;
}

interface TestsSectionProps {
  tests: Test[];
}

const TestsSection: React.FC<TestsSectionProps> = ({ tests }) => {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (tests.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TestTube className="h-6 w-6 text-cyan-600" />
        <h2 className="text-xl font-semibold text-gray-900">Рекомендованные анализы</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="border-2 border-cyan-200 hover:border-cyan-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <TestTube className="h-4 w-4 text-cyan-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">{test.testName}</CardTitle>
                </div>
                <Badge className={`text-xs ${getPriorityColor(test.priority)}`}>
                  {test.priority === 'high' ? 'Высокий' : test.priority === 'medium' ? 'Средний' : 'Низкий'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 mb-2">{test.reason}</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Частота:</strong> {test.frequency}</div>
                <div><strong>Стоимость:</strong> {test.expectedCost}</div>
                <div><strong>Где сдать:</strong> {test.whereToGet}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TestsSection;
