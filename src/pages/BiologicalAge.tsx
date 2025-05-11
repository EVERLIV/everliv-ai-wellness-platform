
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

const BiologicalAge = () => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial } = useSubscription();
  const [formStep, setFormStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    sleepHours: "",
    exerciseFrequency: "",
    diet: "",
    smoking: "no",
    alcohol: "rarely",
    stress: "moderate",
    chronicConditions: "no"
  });

  const canUseHealthAnalysis = canUseFeature(FEATURES.COMPREHENSIVE_ASSESSMENT);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleNextStep = () => {
    if (formStep < 3) {
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
        await recordFeatureTrial(FEATURES.COMPREHENSIVE_ASSESSMENT);
      }

      // Mock calculation for now - we'd replace with actual API call
      setTimeout(() => {
        // Parse chronological age to calculate difference
        const chronologicalAge = parseInt(formData.age);
        
        // Calculate biological age (mock implementation)
        let biologicalAge = chronologicalAge;
        
        // Adjust based on lifestyle factors
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
        
        // Ensure biological age isn't negative
        biologicalAge = Math.max(biologicalAge, 15);
        
        const mockResults = {
          chronologicalAge,
          biologicalAge,
          difference: chronologicalAge - biologicalAge,
          recommendations: [
            formData.exerciseFrequency !== 'daily' && "Увеличьте физическую активность до 30 минут ежедневно.",
            formData.diet !== 'healthy' && "Перейдите на более сбалансированное питание с большим количеством овощей и фруктов.",
            parseInt(formData.sleepHours) < 7 && "Стремитесь к 7-8 часам сна каждую ночь для оптимального восстановления.",
            formData.stress === 'high' && "Практикуйте методы управления стрессом, такие как медитация или йога.",
            formData.alcohol === 'frequently' && "Сократите потребление алкоголя для улучшения общего состояния здоровья.",
            formData.smoking === 'yes' && "Отказ от курения может значительно улучшить вашу биологическую молодость.",
          ].filter(Boolean),
        };

        setResults(mockResults);
        setFormStep(4); // Go to results step
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
              
              {!user ? (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Требуется авторизация</AlertTitle>
                  <AlertDescription>
                    Для использования функции расчета биологического возраста необходимо авторизоваться
                  </AlertDescription>
                </Alert>
              ) : !canUseHealthAnalysis ? (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Функция недоступна</AlertTitle>
                  <AlertDescription>
                    Вы уже использовали бесплатную пробную версию теста на биологический возраст. Для продолжения оформите подписку.
                  </AlertDescription>
                </Alert>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Тест на биологический возраст</CardTitle>
                    <CardDescription>
                      Ответьте на вопросы о вашем образе жизни для определения вашего биологического возраста
                    </CardDescription>
                    
                    {formStep < 4 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Шаг {formStep} из 3</span>
                          <span>{Math.round((formStep/3) * 100)}%</span>
                        </div>
                        <Progress value={(formStep/3) * 100} className="h-2" />
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
                                ваших ответов. Для более точной оценки рекомендуется комплексное медицинское обследование.
                              </p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    {formStep > 1 && formStep < 4 && (
                      <Button variant="outline" onClick={handlePrevStep}>
                        Назад
                      </Button>
                    )}
                    
                    {formStep === 4 ? (
                      <Button variant="outline" onClick={() => setFormStep(1)}>
                        Пройти тест заново
                      </Button>
                    ) : formStep < 3 ? (
                      <Button 
                        onClick={handleNextStep}
                        disabled={!isStepComplete(formStep)}
                      >
                        Далее
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleCalculate}
                        disabled={!isStepComplete(formStep) || isCalculating}
                      >
                        {isCalculating ? "Расчет..." : "Рассчитать возраст"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BiologicalAge;
