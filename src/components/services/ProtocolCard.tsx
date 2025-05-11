
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ProtocolProps {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: string[];
  benefits: string[];
  warnings?: string[];
}

const difficultyClasses = {
  beginner: {
    text: 'Начинающий',
    color: 'bg-green-100 text-green-800'
  },
  intermediate: {
    text: 'Средний',
    color: 'bg-blue-100 text-blue-800'
  },
  advanced: {
    text: 'Продвинутый',
    color: 'bg-purple-100 text-purple-800'
  }
};

const ProtocolCard: React.FC<ProtocolProps> = ({
  title,
  description,
  difficulty,
  duration,
  steps,
  benefits,
  warnings
}) => {
  const difficultyInfo = difficultyClasses[difficulty];

  return (
    <Card className="mb-6 overflow-hidden border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyInfo.color}`}>
              {difficultyInfo.text}
            </span>
            <span className="text-sm text-gray-600">{duration}</span>
          </div>
        </div>
        <p className="text-gray-700">{description}</p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Шаги:</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {steps.map((step, index) => (
              <li key={index} className="pl-1">{step}</li>
            ))}
          </ol>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Польза:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {benefits.map((benefit, index) => (
              <li key={index} className="pl-1">{benefit}</li>
            ))}
          </ul>
        </div>
        {warnings && warnings.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            <h4 className="font-semibold mb-2">Предостережения:</h4>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="pl-1">{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50">
        <Button variant="outline" className="w-full">Добавить в мою программу</Button>
      </CardFooter>
    </Card>
  );
};

export default ProtocolCard;
