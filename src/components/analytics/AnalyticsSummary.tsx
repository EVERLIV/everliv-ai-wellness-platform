import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, TrendingUp, AlertCircle, Target, Pill, Activity } from "lucide-react";
interface AnalyticsSummaryProps {
  healthData: any;
  onDoctorQuestion: () => void;
  doctorQuestion: string;
  setDoctorQuestion: (question: string) => void;
  doctorResponse: string;
  isProcessingQuestion: boolean;
}
const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
  healthData,
  onDoctorQuestion,
  doctorQuestion,
  setDoctorQuestion,
  doctorResponse,
  isProcessingQuestion
}) => {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Краткий обзор */}
      <div className="space-y-6">
        {/* Рекомендации */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Персональные рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData?.recommendations?.slice(0, 3).map((rec: any) => <div key={rec.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Факторы риска */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Факторы риска
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData?.riskFactors?.map((risk: any) => <div key={risk.id} className="p-3 border-l-4 border-orange-200 bg-orange-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-gray-900">{risk.factor}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${risk.level === 'high' ? 'bg-red-100 text-red-700' : risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {risk.level === 'high' ? 'Высокий' : risk.level === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{risk.description}</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    Рекомендация: {risk.mitigation}
                  </p>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Рекомендуемые добавки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-500" />
              Рекомендуемые добавки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData?.supplements?.map((supplement: any) => <div key={supplement.id} className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">{supplement.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{supplement.benefit}</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {supplement.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Принимать: {supplement.timing}
                  </p>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Доктор EVERLIV */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              Спросить доктора EVERLIV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Задайте вопрос о ваших показателях здоровья, рекомендациях или любых других 
              медицинских вопросах. ИИ-доктор EVERLIV даст персональный ответ на основе 
              ваших данных.
            </p>

            <div className="space-y-4">
              <Textarea placeholder="Например: Почему у меня низкий витамин D и как это исправить?" value={doctorQuestion} onChange={e => setDoctorQuestion(e.target.value)} rows={3} className="resize-none" />

              <div className="flex space-x-3">
                <Button onClick={onDoctorQuestion} disabled={!doctorQuestion.trim() || isProcessingQuestion} className="flex-1">
                  {isProcessingQuestion ? <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Обрабатываю...
                    </> : <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Задать вопрос
                    </>}
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Записаться к врачу
                </Button>
              </div>
            </div>

            {doctorResponse && <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-200 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 text-sm mb-2">
                      Ответ доктора EVERLIV:
                    </h4>
                    <p className="text-sm text-green-800 leading-relaxed">
                      {doctorResponse}
                    </p>
                  </div>
                </div>
              </div>}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Важно:</strong> Рекомендации ИИ-доктора носят информационный характер. 
                Для точной диагностики и лечения обязательно проконсультируйтесь с врачом.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default AnalyticsSummary;