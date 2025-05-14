import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export interface ProtocolProps {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: string[];
  benefits: string[];
  warnings?: string[];
  category: string;
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
  warnings,
  category
}) => {
  const difficultyInfo = difficultyClasses[difficulty];
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const addToMyProgram = async () => {
    if (!user) {
      toast("Требуется авторизация", {
        description: "Для добавления протокола в программу необходимо войти в систему",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    try {
      const protocolData = {
        user_id: user.id,
        title,
        description,
        difficulty,
        duration,
        steps,
        benefits,
        warnings: warnings || [],
        category,
        added_at: new Date().toISOString(),
        status: 'not_started',
        completion_percentage: 0
      };
      
      const { data, error } = await supabase
        .from('user_protocols')
        .upsert(protocolData, { 
          onConflict: 'user_id,title,category',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      
      toast("Протокол добавлен", {
        description: "Протокол успешно добавлен в вашу программу",
      });
    } catch (error) {
      console.error("Ошибка при добавлении протокола:", error);
      toast("Ошибка", {
        description: "Не удалось добавить протокол в программу",
        variant: "destructive"
      });
    }
  };

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
        <Button onClick={addToMyProgram} variant="outline" className="w-full">Добавить в мою программу</Button>
      </CardFooter>
    </Card>
  );
};

export default ProtocolCard;
