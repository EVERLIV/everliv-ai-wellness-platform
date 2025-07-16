import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info,
  Brain
} from 'lucide-react';
import type { AIDiagnosticAnalysis } from '@/types/diagnostics';

interface ECGAnalysisResultsProps {
  analysis: AIDiagnosticAnalysis;
  className?: string;
}

const ECGAnalysisResults: React.FC<ECGAnalysisResultsProps> = ({ analysis, className }) => {
  const findings = analysis.ai_findings;
  
  if (!findings || analysis.analysis_status !== 'completed') {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Анализ ЭКГ в процессе...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (findings.parsing_error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Произошла ошибка при анализе ЭКГ. Попробуйте загрузить файл еще раз.
        </AlertDescription>
      </Alert>
    );
  }

  const confidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'низкий': return 'bg-green-100 text-green-800';
      case 'средний': return 'bg-yellow-100 text-yellow-800';
      case 'высокий': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with confidence */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle>Результаты ИИ-анализа ЭКГ</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Уверенность:</span>
              <Badge variant="outline" className={confidenceColor(findings.confidence_score || 0.5)}>
                {Math.round((findings.confidence_score || 0.5) * 100)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress 
            value={(findings.confidence_score || 0.5) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Rhythm Analysis */}
      {findings.rhythm_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Анализ ритма
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Тип ритма</p>
                <p className="text-lg font-semibold">{findings.rhythm_analysis.rhythm_type}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">ЧСС</p>
                <p className="text-lg font-semibold">
                  {findings.rhythm_analysis.heart_rate} уд/мин
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Регулярность</p>
                <Badge variant={findings.rhythm_analysis.regularity === 'регулярный' ? 'default' : 'destructive'}>
                  {findings.rhythm_analysis.regularity}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intervals */}
      {findings.intervals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Интервалы и сегменты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {findings.intervals.pr_interval && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">PR интервал</p>
                  <Badge variant="outline">{findings.intervals.pr_interval}</Badge>
                </div>
              )}
              {findings.intervals.qrs_duration && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">QRS комплекс</p>
                  <Badge variant="outline">{findings.intervals.qrs_duration}</Badge>
                </div>
              )}
              {findings.intervals.qt_interval && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">QT интервал</p>
                  <Badge variant="outline">{findings.intervals.qt_interval}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Morphology */}
      {findings.morphology && (
        <Card>
          <CardHeader>
            <CardTitle>Морфология зубцов и комплексов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {findings.morphology.p_waves && (
                <div>
                  <h4 className="font-medium mb-2">Зубцы P</h4>
                  <p className="text-muted-foreground">{findings.morphology.p_waves}</p>
                </div>
              )}
              {findings.morphology.qrs_complex && (
                <div>
                  <h4 className="font-medium mb-2">Комплекс QRS</h4>
                  <p className="text-muted-foreground">{findings.morphology.qrs_complex}</p>
                </div>
              )}
              {findings.morphology.t_waves && (
                <div>
                  <h4 className="font-medium mb-2">Зубцы T</h4>
                  <p className="text-muted-foreground">{findings.morphology.t_waves}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pathological Findings */}
      {findings.pathological_findings && findings.pathological_findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Патологические изменения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {findings.pathological_findings.map((finding: string, index: number) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{finding}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Interpretation */}
      {findings.clinical_interpretation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Клиническая интерпретация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {findings.clinical_interpretation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      {findings.risk_assessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Оценка риска
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Уровень риска</p>
                <Badge className={getRiskColor(findings.risk_assessment.level)}>
                  {findings.risk_assessment.level}
                </Badge>
              </div>
              {findings.risk_assessment.factors && findings.risk_assessment.factors.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Факторы риска</p>
                  <div className="space-y-1">
                    {findings.risk_assessment.factors.map((factor: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {findings.recommendations && findings.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {findings.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-2 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Детали анализа
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Время анализа:</p>
              <p>{new Date(analysis.created_at).toLocaleString('ru-RU')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Тип анализа:</p>
              <p className="capitalize">{analysis.analysis_type}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ECGAnalysisResults;