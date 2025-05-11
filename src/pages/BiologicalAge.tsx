
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { Skeleton } from "@/components/ui/skeleton";
import FeatureAccess from "@/components/FeatureAccess";

const BiologicalAge = () => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial } = useSubscription();
  const [formStep, setFormStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic info
    age: "",
    gender: "",
    height: "",
    weight: "",
    // Lifestyle data
    sleepHours: "",
    exerciseFrequency: "",
    diet: "",
    smoking: "no",
    alcohol: "rarely",
    stress: "moderate",
    // Medical history
    chronicConditions: "no",
    // Analysis data
    cholesterol: "",
    hdlCholesterol: "",
    ldlCholesterol: "",
    triglycerides: "",
    glucose: "",
    hba1c: "",
    creatinine: "",
    vitaminD: "",
    inflammation: "",
    // Advanced tests
    telomereLengthTest: "no",
    epigeneticTest: "no",
  });

  const canUseHealthAnalysis = canUseFeature(FEATURES.BIOLOGICAL_AGE_TEST);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleNextStep = () => {
    if (formStep < 4) {
      setFormStep(formStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      // Record feature trial
      if (user && canUseHealthAnalysis) {
        await recordFeatureTrial(FEATURES.BIOLOGICAL_AGE_TEST);
      }

      // Mock calculation for now - we'd replace with actual API call
      setTimeout(() => {
        // Parse chronological age to calculate difference
        const chronologicalAge = parseInt(formData.age);
        
        // Calculate biological age (mock implementation)
        let biologicalAge = chronologicalAge;
        
        // Adjust based on lifestyle factors and analysis data
        if (formData.exerciseFrequency === 'daily') {
          biologicalAge -= 3;
        } else if (formData.exerciseFrequency === 'weekly') {
          biologicalAge -= 1;
        } else {
          biologicalAge += 2;
        }
        
        if (formData.smoking === 'yes') {
          biologicalAge += 5;
        }
        
        if (formData.diet === 'healthy') {
          biologicalAge -= 2;
        } else if (formData.diet === 'unhealthy') {
          biologicalAge += 3;
        }
        
        if (formData.alcohol === 'frequently') {
          biologicalAge += 3;
        }
        
        if (formData.stress === 'high') {
          biologicalAge += 2;
        }
        
        if (parseInt(formData.sleepHours) < 6) {
          biologicalAge += 2;
        } else if (parseInt(formData.sleepHours) >= 8) {
          biologicalAge -= 1;
        }
        
        if (formData.chronicConditions === 'yes') {
          biologicalAge += 4;
        }
        
        // Adjust based on blood analysis data if provided
        if (formData.cholesterol && parseFloat(formData.cholesterol) > 5.2) {
          biologicalAge += 2;
        }
        
        if (formData.glucose && parseFloat(formData.glucose) > 6.0) {
          biologicalAge += 3;
        }
        
        if (formData.vitaminD && parseFloat(formData.vitaminD) < 30) {
          biologicalAge += 1;
        }
        
        if (formData.inflammation && parseFloat(formData.inflammation) > 3) {
          biologicalAge += 2;
        }
        
        // If advanced tests are done, they have a stronger impact on the calculation
        if (formData.telomereLengthTest === 'yes') {
          biologicalAge -= 2; // Assuming good results for this mock
        }
        
        if (formData.epigeneticTest === 'yes') {
          biologicalAge -= 3; // Assuming good results for this mock
        }
        
        // Ensure biological age isn't negative
        biologicalAge = Math.max(biologicalAge, 15);
        
        // Generate recommendations based on inputs
        const recommendations = [];
        
        if (formData.exerciseFrequency !== 'daily') {
          recommendations.push("Увеличьте физическую активность до 30 минут ежедневно.");
        }
        
        if (formData.diet !== 'healthy') {
          recommendations.push("Перейдите на более сбалансированное питание с большим количеством овощей и фруктов.");
        }
        
        if (parseInt(formData.sleepHours) < 7) {
          recommendations.push("Стремитесь к 7-8 часам сна каждую ночь для оптимального восстановления.");
        }
        
        if (formData.stress === 'high') {
          recommendations.push("Практикуйте методы управления стрессом, такие как медитация или йога.");
        }
        
        if (formData.alcohol === 'frequently') {
          recommendations.push("Сократите потребление алкоголя для улучшения общего состояния здоровья.");
        }
        
        if (formData.smoking === 'yes') {
          recommendations.push("Отказ от курения может значительно улучшить вашу биологическую молодость.");
        }
        
        if (formData.cholesterol && parseFloat(formData.cholesterol) > 5.2) {
          recommendations.push("Снижение уровня холестерина через диету и упражнения. Рассмотрите консультацию с врачом.");
        }
        
        if (formData.glucose && parseFloat(formData.glucose) > 6.0) {
          recommendations.push("Контролируйте уровень глюкозы путем снижения потребления простых углеводов.");
        }
        
        if (formData.vitaminD && parseFloat(formData.vitaminD) < 30) {
          recommendations.push("Рассмотрите добавки витамина D и больше времени проводите на солнце.");
        }

        const mockResults = {
          chronologicalAge,
          biologicalAge,
          difference: chronologicalAge - biologicalAge,
          recommendations: recommendations.filter(Boolean),
          bloodAnalysisContribution: formData.cholesterol || formData.glucose || formData.vitaminD ? 
            "Данные анализов крови были учтены в расчете вашего биологического возраста" : 
            "Добавление данных анализов крови позволит получить более точную оценку биологического возраста",
          accuracyScore: (formData.cholesterol || formData.glucose || formData.vitaminD) ? 75 : 60
        };

        setResults(mockResults);
        setFormStep(5); // Go to results step
        toast.success("Расчет биологического возраста завершен");
      }, 2000);
    } catch (error) {
      console.error("Ошибка расчета:", error);
      toast.error("Произошла ошибка при расчете биологического возраста");
    } finally {
      setIsCalculating(false);
    }
  };

  const isStepComplete = (step: number) => {
    if (step === 1) {
      return !!formData.age && !!formData.gender && !!formData.height && !!formData.weight;
    } 
    if (step === 2) {
      return !!formData.sleepHours && !!formData.exerciseFrequency && !!formData.diet;
    }
    if (step === 3) {
      return !!formData.smoking && !!formData.alcohol && !!formData.stress && !!formData.chronicConditions;
    }
    if (step === 4) {
      // This is optional data, so always return true
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6 space-x-3">
                <Clock className="h-8 w-8 text-everliv-600" />
                <h1 className="text-3xl md:text-4xl font-bold">Тест на биологический возраст</h1>
              </div>
              
              <FeatureAccess
                featureName={FEATURES.BIOLOGICAL_AGE_TEST}
                title="Тест на биологический возраст"
                description="Определение биологического возраста и факторов здоровья с использованием искусственного интеллекта"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Тест на биологический возраст</CardTitle>
                    <CardDescription>
                      Ответьте на вопросы о вашем образе жизни и здоровье для определения вашего биологического возраста
                    </CardDescription>
                    
                    {formStep < 5 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Шаг {formStep} из 4</span>
                          <span>{Math.round((formStep/4) * 100)}%</span>
                        </div>
                        <Progress value={(formStep/4) * 100} className="h-2" />
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {formStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Основные параметры</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="age">Возраст</Label>
                            <Input 
                              id="age" 
                              type="number"
                              placeholder="Лет"
                              value={formData.age}
                              onChange={(e) => handleInputChange('age', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">Пол</Label>
                            <Select 
                              value={formData.gender} 
                              onValueChange={(value) => handleInputChange('gender', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите пол" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Мужской</SelectItem>
                                <SelectItem value="female">Женский</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="height">Рост (см)</Label>
                            <Input 
                              id="height" 
                              type="number"
                              placeholder="См"
                              value={formData.height}
                              onChange={(e) => handleInputChange('height', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="weight">Вес (кг)</Label>
                            <Input 
                              id="weight" 
                              type="number"
                              placeholder="Кг"
                              value={formData.weight}
                              onChange={(e) => handleInputChange('weight', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Образ жизни</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="sleepHours">Сколько часов в среднем вы спите?</Label>
                            <Select 
                              value={formData.sleepHours} 
                              onValueChange={(value) => handleInputChange('sleepHours', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите количество часов" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">Менее 5 часов</SelectItem>
                                <SelectItem value="6">6 часов</SelectItem>
                                <SelectItem value="7">7 часов</SelectItem>
                                <SelectItem value="8">8 часов</SelectItem>
                                <SelectItem value="9">Более 8 часов</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="exerciseFrequency">Как часто вы занимаетесь физической активностью?</Label>
                            <Select 
                              value={formData.exerciseFrequency} 
                              onValueChange={(value) => handleInputChange('exerciseFrequency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите частоту" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Ежедневно</SelectItem>
                                <SelectItem value="weekly">Несколько раз в неделю</SelectItem>
                                <SelectItem value="monthly">Несколько раз в месяц</SelectItem>
                                <SelectItem value="rarely">Редко или никогда</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="diet">Какой у вас тип питания?</Label>
                            <Select 
                              value={formData.diet} 
                              onValueChange={(value) => handleInputChange('diet', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип питания" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="healthy">Здоровое и сбалансированное</SelectItem>
                                <SelectItem value="moderate">Умеренное с некоторыми излишествами</SelectItem>
                                <SelectItem value="unhealthy">Преимущественно быстрое питание и полуфабрикаты</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {formStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Факторы риска</h3>
                        <div className="space-y-4">
                          <div>
                            <Label>Вы курите?</Label>
                            <RadioGroup 
                              value={formData.smoking} 
                              onValueChange={(value) => handleInputChange('smoking', value)}
                              className="flex gap-4 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="smoking-yes" />
                                <Label htmlFor="smoking-yes">Да</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="smoking-no" />
                                <Label htmlFor="smoking-no">Нет</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <Label>Как часто вы употребляете алкоголь?</Label>
                            <RadioGroup 
                              value={formData.alcohol} 
                              onValueChange={(value) => handleInputChange('alcohol', value)}
                              className="flex flex-col gap-2 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="frequently" id="alcohol-frequently" />
                                <Label htmlFor="alcohol-frequently">Часто (несколько раз в неделю)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="occasionally" id="alcohol-occasionally" />
                                <Label htmlFor="alcohol-occasionally">Иногда (несколько раз в месяц)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rarely" id="alcohol-rarely" />
                                <Label htmlFor="alcohol-rarely">Редко или никогда</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <Label>Уровень стресса в вашей жизни</Label>
                            <RadioGroup 
                              value={formData.stress} 
                              onValueChange={(value) => handleInputChange('stress', value)}
                              className="flex gap-4 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="stress-high" />
                                <Label htmlFor="stress-high">Высокий</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderate" id="stress-moderate" />
                                <Label htmlFor="stress-moderate">Средний</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="stress-low" />
                                <Label htmlFor="stress-low">Низкий</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <Label>Есть ли у вас хронические заболевания?</Label>
                            <RadioGroup 
                              value={formData.chronicConditions} 
                              onValueChange={(value) => handleInputChange('chronicConditions', value)}
                              className="flex gap-4 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="chronic-yes" />
                                <Label htmlFor="chronic-yes">Да</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="chronic-no" />
                                <Label htmlFor="chronic-no">Нет</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    )}

                    {formStep === 4 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Данные лабораторных анализов</h3>
                          <div className="text-sm text-gray-500">(необязательно)</div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Добавьте данные ваших недавних анализов для более точной оценки биологического возраста
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cholesterol">Общий холестерин (ммоль/л)</Label>
                            <Input 
                              id="cholesterol" 
                              type="text"
                              placeholder="Например: 5.2"
                              value={formData.cholesterol}
                              onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="hdlCholesterol">HDL-холестерин (ммоль/л)</Label>
                            <Input 
                              id="hdlCholesterol" 
                              type="text"
                              placeholder="Например: 1.4"
                              value={formData.hdlCholesterol}
                              onChange={(e) => handleInputChange('hdlCholesterol', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="ldlCholesterol">LDL-холестерин (ммоль/л)</Label>
                            <Input 
                              id="ldlCholesterol" 
                              type="text"
                              placeholder="Например: 3.0"
                              value={formData.ldlCholesterol}
                              onChange={(e) => handleInputChange('ldlCholesterol', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="triglycerides">Триглицериды (ммоль/л)</Label>
                            <Input 
                              id="triglycerides" 
                              type="text"
                              placeholder="Например: 1.7"
                              value={formData.triglycerides}
                              onChange={(e) => handleInputChange('triglycerides', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="glucose">Глюкоза (ммоль/л)</Label>
                            <Input 
                              id="glucose" 
                              type="text"
                              placeholder="Например: 5.4"
                              value={formData.glucose}
                              onChange={(e) => handleInputChange('glucose', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="hba1c">HbA1c (%)</Label>
                            <Input 
                              id="hba1c" 
                              type="text"
                              placeholder="Например: 5.2"
                              value={formData.hba1c}
                              onChange={(e) => handleInputChange('hba1c', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="creatinine">Креатинин (мкмоль/л)</Label>
                            <Input 
                              id="creatinine" 
                              type="text"
                              placeholder="Например: 80"
                              value={formData.creatinine}
                              onChange={(e) => handleInputChange('creatinine', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vitaminD">Витамин D (нг/мл)</Label>
                            <Input 
                              id="vitaminD" 
                              type="text"
                              placeholder="Например: 35"
                              value={formData.vitaminD}
                              onChange={(e) => handleInputChange('vitaminD', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="inflammation">С-реактивный белок (мг/л)</Label>
                            <Input 
                              id="inflammation" 
                              type="text"
                              placeholder="Например: 1.5"
                              value={formData.inflammation}
                              onChange={(e) => handleInputChange('inflammation', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div>
                          <h4 className="font-medium mb-3">Продвинутые тесты на старение</h4>
                          
                          <div className="space-y-4">
                            <div>
                              <Label>Проходили ли вы тест на длину теломер?</Label>
                              <RadioGroup 
                                value={formData.telomereLengthTest} 
                                onValueChange={(value) => handleInputChange('telomereLengthTest', value)}
                                className="flex gap-4 mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="telomere-yes" />
                                  <Label htmlFor="telomere-yes">Да</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="telomere-no" />
                                  <Label htmlFor="telomere-no">Нет</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div>
                              <Label>Проходили ли вы эпигенетический тест (метилирование ДНК)?</Label>
                              <RadioGroup 
                                value={formData.epigeneticTest} 
                                onValueChange={(value) => handleInputChange('epigeneticTest', value)}
                                className="flex gap-4 mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="epigenetic-yes" />
                                  <Label htmlFor="epigenetic-yes">Да</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="epigenetic-no" />
                                  <Label htmlFor="epigenetic-no">Нет</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formStep === 5 && (
                      <div className="space-y-6">
                        {isCalculating ? (
                          <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-32 w-full" />
                          </div>
                        ) : results ? (
                          <>
                            <div className="flex flex-col items-center justify-center py-6">
                              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">Ваш биологический возраст</p>
                                  <p className="text-5xl font-bold text-everliv-600">{results.biologicalAge}</p>
                                  <p className="text-sm text-gray-500">лет</p>
                                </div>
                              </div>
                              
                              <div className={`text-center ${results.difference > 0 ? 'text-green-600' : results.difference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {results.difference > 0 ? (
                                  <p className="font-medium">На {Math.abs(results.difference)} лет моложе вашего хронологического возраста!</p>
                                ) : results.difference < 0 ? (
                                  <p className="font-medium">На {Math.abs(results.difference)} лет старше вашего хронологического возраста</p>
                                ) : (
                                  <p className="font-medium">Соответствует вашему хронологическому возрасту</p>
                                )}
                              </div>
                              
                              <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">Точность оценки</p>
                                <div className="relative pt-1 w-48 mx-auto">
                                  <Progress value={results.accuracyScore} className="h-2 mt-2" />
                                  <div className="flex justify-between mt-1">
                                    <span className="text-xs">0%</span>
                                    <span className="text-xs">{results.accuracyScore}%</span>
                                    <span className="text-xs">100%</span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{results.bloodAnalysisContribution}</p>
                              </div>
                            </div>
                            
                            <div className="pt-4">
                              <h3 className="text-lg font-medium mb-3">Рекомендации для улучшения биологического возраста</h3>
                              <ul className="space-y-2">
                                {results.recommendations.map((recommendation: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="min-w-4 mt-1">•</div>
                                    <div>{recommendation}</div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                              <p className="text-sm text-gray-600">
                                Внимание: Этот тест предоставляет приблизительную оценку биологического возраста на основе 
                                ваших ответов. Для более точной оценки рекомендуется комплексное медицинское обследование
                                и дополнительные лабораторные анализы.
                              </p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    {formStep > 1 && formStep < 5 && (
                      <Button variant="outline" onClick={handlePrevStep}>
                        Назад
                      </Button>
                    )}
                    
                    {formStep === 5 ? (
                      <Button variant="outline" onClick={() => setFormStep(1)}>
                        Пройти тест заново
                      </Button>
                    ) : formStep < 4 ? (
                      <Button 
                        onClick={handleNextStep}
                        disabled={!isStepComplete(formStep)}
                      >
                        Далее
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleCalculate}
                        disabled={isCalculating}
                      >
                        {isCalculating ? "Расчет..." : "Рассчитать возраст"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </FeatureAccess>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BiologicalAge;
