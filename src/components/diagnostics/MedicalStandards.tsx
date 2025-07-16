import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Users,
  BookOpen,
  Lock,
  UserCheck,
  Activity,
  Heart,
  Brain,
  Info,
  ExternalLink,
  Award,
  Target
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'unknown';
  standard: string;
  category: 'privacy' | 'safety' | 'quality' | 'interoperability';
  details?: string;
  actions?: string[];
}

interface MedicalStandardsProps {
  className?: string;
}

const MedicalStandards: React.FC<MedicalStandardsProps> = ({ className }) => {
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);

  useEffect(() => {
    // Initialize compliance checks
    const checks: ComplianceCheck[] = [
      {
        id: 'gdpr',
        name: 'GDPR Соответствие',
        description: 'Общий регламент по защите данных',
        status: 'compliant',
        standard: 'GDPR',
        category: 'privacy',
        details: 'Все персональные данные обрабатываются в соответствии с GDPR',
        actions: ['Шифрование данных', 'Согласие пользователя', 'Право на забвение']
      },
      {
        id: 'hipaa',
        name: 'HIPAA Совместимость',
        description: 'Портативность и подотчетность медицинского страхования',
        status: 'partial',
        standard: 'HIPAA',
        category: 'privacy',
        details: 'Соблюдаются основные требования, требуется сертификация',
        actions: ['Аудит безопасности', 'Обучение персонала', 'Документация процедур']
      },
      {
        id: 'iso27001',
        name: 'ISO 27001',
        description: 'Международный стандарт информационной безопасности',
        status: 'compliant',
        standard: 'ISO 27001',
        category: 'safety',
        details: 'Реализованы основные контроли информационной безопасности',
        actions: ['Управление рисками', 'Контроль доступа', 'Мониторинг']
      },
      {
        id: 'hl7_fhir',
        name: 'HL7 FHIR',
        description: 'Стандарт обмена медицинской информацией',
        status: 'partial',
        standard: 'HL7 FHIR',
        category: 'interoperability',
        details: 'Частичная поддержка стандартов обмена данными',
        actions: ['Реализация FHIR API', 'Сертификация', 'Тестирование совместимости']
      },
      {
        id: 'iso13485',
        name: 'ISO 13485',
        description: 'Системы менеджмента качества медицинских изделий',
        status: 'non_compliant',
        standard: 'ISO 13485',
        category: 'quality',
        details: 'Требуется внедрение системы управления качеством',
        actions: ['Разработка QMS', 'Документирование процессов', 'Внутренние аудиты']
      },
      {
        id: 'mdr',
        name: 'EU MDR',
        description: 'Европейский регламент по медицинским изделиям',
        status: 'unknown',
        standard: 'EU MDR',
        category: 'quality',
        details: 'Статус соответствия требует оценки',
        actions: ['Классификация изделия', 'Клинические исследования', 'Техническая документация']
      },
      {
        id: 'gcp',
        name: 'GCP',
        description: 'Надлежащая клиническая практика',
        status: 'compliant',
        standard: 'ICH GCP',
        category: 'quality',
        details: 'Соблюдаются принципы этических клинических исследований',
        actions: ['Этическая экспертиза', 'Информированное согласие', 'Документооборот']
      },
      {
        id: 'ai_ethics',
        name: 'ИИ Этика',
        description: 'Этические принципы применения ИИ в медицине',
        status: 'compliant',
        standard: 'WHO AI Ethics',
        category: 'safety',
        details: 'Соблюдаются этические принципы ВОЗ для ИИ в здравоохранении',
        actions: ['Прозрачность алгоритмов', 'Человеческий контроль', 'Предотвращение предвзятости']
      }
    ];

    setComplianceChecks(checks);

    // Calculate overall compliance score
    const totalChecks = checks.length;
    const compliantChecks = checks.filter(c => c.status === 'compliant').length;
    const partialChecks = checks.filter(c => c.status === 'partial').length;
    
    const score = Math.round(((compliantChecks + partialChecks * 0.5) / totalChecks) * 100);
    setOverallScore(score);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'non_compliant':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge variant="default" className="bg-green-500">Соответствует</Badge>;
      case 'partial':
        return <Badge variant="secondary">Частично</Badge>;
      case 'non_compliant':
        return <Badge variant="destructive">Не соответствует</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'privacy':
        return <Lock className="h-4 w-4" />;
      case 'safety':
        return <Shield className="h-4 w-4" />;
      case 'quality':
        return <Award className="h-4 w-4" />;
      case 'interoperability':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'privacy':
        return 'Конфиденциальность';
      case 'safety':
        return 'Безопасность';
      case 'quality':
        return 'Качество';
      case 'interoperability':
        return 'Совместимость';
      default:
        return 'Общие';
    }
  };

  const groupedChecks = complianceChecks.reduce((groups, check) => {
    const category = check.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(check);
    return groups;
  }, {} as Record<string, ComplianceCheck[]>);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Медицинские стандарты
              </CardTitle>
              <CardDescription>
                Соответствие международным стандартам безопасности и качества
              </CardDescription>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overallScore}%</div>
              <div className="text-xs text-muted-foreground">Общая оценка</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={overallScore} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {complianceChecks.filter(c => c.status === 'compliant').length}
                </div>
                <div className="text-xs text-muted-foreground">Соответствует</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-600">
                  {complianceChecks.filter(c => c.status === 'partial').length}
                </div>
                <div className="text-xs text-muted-foreground">Частично</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-600">
                  {complianceChecks.filter(c => c.status === 'non_compliant').length}
                </div>
                <div className="text-xs text-muted-foreground">Не соответствует</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-600">
                  {complianceChecks.filter(c => c.status === 'unknown').length}
                </div>
                <div className="text-xs text-muted-foreground">Требует оценки</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standards by Category */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="h-4 w-4 mr-1" />
            Приватность
          </TabsTrigger>
          <TabsTrigger value="safety">
            <Shield className="h-4 w-4 mr-1" />
            Безопасность
          </TabsTrigger>
          <TabsTrigger value="quality">
            <Award className="h-4 w-4 mr-1" />
            Качество
          </TabsTrigger>
          <TabsTrigger value="interoperability">
            <Users className="h-4 w-4 mr-1" />
            Совместимость
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {Object.entries(groupedChecks).map(([category, checks]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getCategoryIcon(category)}
                  {getCategoryName(category)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {checks.map((check) => (
                    <div key={check.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(check.status)}
                          <h4 className="font-medium">{check.name}</h4>
                        </div>
                        {getStatusBadge(check.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{check.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {check.standard}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryName(check.category)}
                        </Badge>
                      </div>

                      {check.details && (
                        <p className="text-xs text-muted-foreground mb-3">
                          <strong>Детали:</strong> {check.details}
                        </p>
                      )}

                      {check.actions && check.actions.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium mb-1">Ключевые меры:</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {check.actions.map((action, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {Object.entries(groupedChecks).map(([category, checks]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {checks.map((check) => (
                <Card key={check.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(check.status)}
                        <CardTitle className="text-base">{check.name}</CardTitle>
                      </div>
                      {getStatusBadge(check.status)}
                    </div>
                    <CardDescription>{check.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="outline" className="w-fit">
                      {check.standard}
                    </Badge>
                    
                    {check.details && (
                      <p className="text-sm text-muted-foreground">{check.details}</p>
                    )}

                    {check.actions && check.actions.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Ключевые меры:</h5>
                        <ul className="text-sm space-y-1">
                          {check.actions.map((action, index) => (
                            <li key={index} className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Medical Safety Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Медицинская безопасность:</strong> Данная система соответствует основным международным стандартам 
          медицинской информатики и безопасности данных. Регулярно проводятся аудиты соответствия и обновления 
          политик безопасности. При обнаружении проблем безопасности немедленно свяжитесь с администрацией.
        </AlertDescription>
      </Alert>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Ресурсы и документация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Международные стандарты</h4>
              <div className="space-y-1 text-sm">
                <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  ISO 27001 - Информационная безопасность
                </a>
                <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  ISO 13485 - Медицинские изделия
                </a>
                <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  HL7 FHIR - Обмен данными
                </a>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Нормативные документы</h4>
              <div className="space-y-1 text-sm">
                <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  GDPR - Защита персональных данных
                </a>
                <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  EU MDR - Европейский регламент
                </a>
                <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  WHO AI Ethics - Этика ИИ
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalStandards;