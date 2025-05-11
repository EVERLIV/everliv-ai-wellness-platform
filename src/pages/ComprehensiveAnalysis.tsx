
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import FeatureAccess from "@/components/FeatureAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Brain, AlertCircle, FileUpload } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const ComprehensiveAnalysis = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("input");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Form state for comprehensive analysis
  const [formData, setFormData] = useState({
    // Basic info
    age: "",
    gender: "",
    height: "",
    weight: "",
    // Blood analysis
    bloodText: "",
    bloodPhotoUrl: "",
    // Lifestyle data
    sleepHours: "",
    exerciseFrequency: "",
    diet: "",
    smoking: "no",
    alcohol: "rarely",
    stress: "moderate",
    // Medical history
    chronicConditions: "no",
    medications: "",
    familyHistory: "",
    // Additional test results
    cholesterol: "",
    glucose: "",
    bloodPressure: "",
    // Goals
    healthGoals: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload to a server/storage here
      // For now, create a local URL to display the image
      const url = URL.createObjectURL(file);
      handleInputChange('bloodPhotoUrl', url);
      toast.success("Фото загружено");
    }
  };

  const handleAnalyze = async () => {
    if (!formData.age) {
      toast.error("Пожалуйста, введите ваш возраст");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Mock analysis for now - we'd replace with actual AI API call
      setTimeout(() => {
        const mockResults = {
          health: {
            biologicalAge: parseInt(formData.age) - 2,
            overallScore: 82,
            risk: "Низкий",
            primaryConcerns: ["Холестерин", "Стресс"]
          },
          biomarkers: [
            { name: "Гемоглобин", value: "142 г/л", normalRange: "130-160 г/л", status: "normal", recommendation: "В пределах нормы" },
            { name: "Эритроциты", value: "4.7 млн/мкл", normalRange: "4.5-5.5 млн/мкл", status: "normal", recommendation: "В пределах нормы" },
            { name: "Лейкоциты", value: "10.2 тыс/мкл", normalRange: "4.0-9.0 тыс/мкл", status: "high", recommendation: "Повышен. Может указывать на наличие инфекции или воспаления в организме." },
            { name: "Холестерин общий", value: "6.2 ммоль/л", normalRange: "до 5.2 ммоль/л", status: "high", recommendation: "Повышен. Рекомендуется корректировка диеты с уменьшением потребления животных жиров." },
            { name: "Глюкоза", value: "5.4 ммоль/л", normalRange: "3.9-5.8 ммоль/л", status: "normal", recommendation: "В пределах нормы" },
          ],
          recommendations: {
            lifestyle: [
              "Увеличьте физическую активность до 150 минут умеренных аэробных нагрузок в неделю",
              "Практикуйте методики снижения стресса, такие как медитация или глубокое дыхание в течение 10-15 минут ежедневно",
              "Обеспечьте 7-8 часов качественного сна каждую ночь"
            ],
            diet: [
              "Увеличьте потребление продуктов, богатых Омега-3: рыба, льняное семя, грецкие орехи",
              "Снизьте потребление насыщенных жиров и трансжиров для снижения уровня холестерина",
              "Увеличьте потребление пищевых волокон до 25-30 г в день через овощи, фрукты и цельные зерна"
            ],
            supplements: [
              { name: "Омега-3", dosage: "1000 мг ежедневно", reason: "Снижение уровня холестерина и воспаления" },
              { name: "Витамин D", dosage: "2000 МЕ ежедневно", reason: "Поддержка иммунной системы и общего здоровья" },
              { name: "Коэнзим Q10", dosage: "100 мг ежедневно", reason: "Поддержка сердечно-сосудистой системы и энергетический обмен" },
            ],
            medical: [
              "Рекомендуется контроль липидного профиля через 3 месяца после корректировки диеты и образа жизни",
              "При сохранении повышенного уровня лейкоцитов более 2 недель, рекомендуется консультация терапевта"
            ],
          },
          healthPlan: {
            shortTerm: "Снижение уровня холестерина через диету и физическую активность в течение 3-6 месяцев",
            mediumTerm: "Снижение биологического возраста на 2-3 года в ближайшие 12 месяцев через комплексные меры",
            longTerm: "Снижение вероятности развития сердечно-сосудистых заболеваний на 30-40% в течение 5 лет"
          }
        };

        setResults(mockResults);
        setActiveTab("results");
        toast.success("Комплексный анализ успешно завершен");
      }, 3000);
    } catch (error) {
      console.error("Ошибка анализа:", error);
      toast.error("Произошла ошибка при анализе");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6 space-x-3">
                <Brain className="h-8 w-8 text-everliv-600" />
                <h1 className="text-3xl md:text-4xl font-bold">Комплексный AI анализ</h1>
              </div>

              <FeatureAccess
                featureName={FEATURES.COMPREHENSIVE_AI_ANALYSIS}
                title="Комплексный AI анализ"
                description="Полная оценка здоровья на основе всех ваших данных с использованием искусственного интеллекта"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Комплексный AI анализ здоровья</CardTitle>
                    <CardDescription>
                      Введите информацию о вашем здоровье для получения детального AI анализа и персонализированного плана улучшений
                    </CardDescription>
                  </CardHeader>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mx-6">
                      <TabsTrigger value="input">Ввод данных</TabsTrigger>
                      <TabsTrigger value="results" disabled={!results}>Результаты</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="input">
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Основные данные</h3>
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
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Данные анализов крови</h3>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="bloodText">Введите результаты вашего анализа крови</Label>
                                <Textarea 
                                  id="bloodText"
                                  placeholder="Например: Гемоглобин: 142 г/л, Эритроциты: 4.7 млн/мкл..."
                                  value={formData.bloodText}
                                  onChange={(e) => handleInputChange('bloodText', e.target.value)}
                                  rows={5}
                                  className="resize-none"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="bloodPhoto" className="block mb-2">Или загрузите фото результатов</Label>
                                <div className="flex items-center gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('bloodPhoto')?.click()}
                                    className="flex items-center gap-2"
                                  >
                                    <FileUpload className="h-4 w-4" />
                                    Загрузить фото
                                  </Button>
                                  <Input 
                                    id="bloodPhoto" 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                  />
                                  {formData.bloodPhotoUrl && (
                                    <div className="relative">
                                      <img 
                                        src={formData.bloodPhotoUrl} 
                                        alt="Загруженное фото анализа" 
                                        className="h-16 w-16 object-cover rounded border"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Дополнительные данные анализов</h3>
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
                                <Label htmlFor="bloodPressure">Артериальное давление</Label>
                                <Input 
                                  id="bloodPressure" 
                                  type="text"
                                  placeholder="Например: 120/80"
                                  value={formData.bloodPressure}
                                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Образ жизни</h3>
                            <div className="grid grid-cols-2 gap-4">
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
                            
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <Label className="block mb-2">Вы курите?</Label>
                                <RadioGroup 
                                  value={formData.smoking} 
                                  onValueChange={(value) => handleInputChange('smoking', value)}
                                  className="flex gap-4"
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
                              
                              <div>
                                <Label className="block mb-2">Как часто вы употребляете алкоголь?</Label>
                                <RadioGroup 
                                  value={formData.alcohol} 
                                  onValueChange={(value) => handleInputChange('alcohol', value)}
                                  className="flex flex-col gap-2"
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
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Медицинская история</h3>
                            <div className="space-y-4">
                              <div>
                                <Label className="block mb-2">Есть ли у вас хронические заболевания?</Label>
                                <RadioGroup 
                                  value={formData.chronicConditions} 
                                  onValueChange={(value) => handleInputChange('chronicConditions', value)}
                                  className="flex gap-4"
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
                              
                              <div>
                                <Label htmlFor="medications">Какие лекарства вы принимаете регулярно?</Label>
                                <Textarea 
                                  id="medications"
                                  placeholder="Перечислите принимаемые препараты"
                                  value={formData.medications}
                                  onChange={(e) => handleInputChange('medications', e.target.value)}
                                  rows={2}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="familyHistory">Семейная история заболеваний</Label>
                                <Textarea 
                                  id="familyHistory"
                                  placeholder="Например: диабет, сердечные заболевания у прямых родственников"
                                  value={formData.familyHistory}
                                  onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Ваши цели</h3>
                            <div>
                              <Label htmlFor="healthGoals">Какие у вас цели в отношении здоровья?</Label>
                              <Textarea 
                                id="healthGoals"
                                placeholder="Например: снижение веса, улучшение выносливости, профилактика заболеваний"
                                value={formData.healthGoals}
                                onChange={(e) => handleInputChange('healthGoals', e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing || !formData.age}
                        >
                          {isAnalyzing ? "Анализ..." : "Провести комплексный анализ"}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                    
                    <TabsContent value="results">
                      <CardContent>
                        {isAnalyzing ? (
                          <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-32 w-full" />
                          </div>
                        ) : results ? (
                          <div className="space-y-8">
                            <div className="bg-gray-50 rounded-lg p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                  <div className="text-sm text-gray-500 mb-1">Биологический возраст</div>
                                  <div className="text-3xl font-bold text-everliv-600">{results.health.biologicalAge}</div>
                                  <div className="text-sm text-gray-500">лет</div>
                                </div>
                                
                                <div className="text-center">
                                  <div className="text-sm text-gray-500 mb-1">Общая оценка здоровья</div>
                                  <div className="relative pt-1">
                                    <div className="text-3xl font-bold text-everliv-600">{results.health.overallScore}</div>
                                    <Progress value={results.health.overallScore} className="h-2 mt-2" />
                                  </div>
                                  <div className="text-sm text-gray-500">из 100</div>
                                </div>
                                
                                <div className="text-center">
                                  <div className="text-sm text-gray-500 mb-1">Риск хронических заболеваний</div>
                                  <div className="text-xl font-bold text-green-600">{results.health.risk}</div>
                                  <div className="text-sm text-gray-500">на основе данных</div>
                                </div>
                              </div>
                              
                              <div className="mt-6">
                                <div className="text-sm text-gray-500 mb-1">Основные проблемы требующие внимания:</div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {results.health.primaryConcerns.map((concern: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                                      {concern}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-3">Анализ биомаркеров</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Показатель</TableHead>
                                    <TableHead>Значение</TableHead>
                                    <TableHead>Норма</TableHead>
                                    <TableHead>Рекомендация</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {results.biomarkers.map((marker: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell>{marker.name}</TableCell>
                                      <TableCell className={`font-medium ${marker.status === 'high' ? 'text-red-500' : marker.status === 'low' ? 'text-amber-500' : 'text-green-500'}`}>
                                        {marker.value}
                                      </TableCell>
                                      <TableCell className="text-gray-500">{marker.normalRange}</TableCell>
                                      <TableCell>{marker.recommendation}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-3">Персонализированные рекомендации</h3>
                              
                              <Tabs defaultValue="lifestyle">
                                <TabsList className="mb-4">
                                  <TabsTrigger value="lifestyle">Образ жизни</TabsTrigger>
                                  <TabsTrigger value="diet">Питание</TabsTrigger>
                                  <TabsTrigger value="supplements">Добавки</TabsTrigger>
                                  <TabsTrigger value="medical">Медицинские</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="lifestyle">
                                  <ul className="space-y-2">
                                    {results.recommendations.lifestyle.map((item: string, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="min-w-4 mt-1">•</div>
                                        <div>{item}</div>
                                      </li>
                                    ))}
                                  </ul>
                                </TabsContent>
                                
                                <TabsContent value="diet">
                                  <ul className="space-y-2">
                                    {results.recommendations.diet.map((item: string, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="min-w-4 mt-1">•</div>
                                        <div>{item}</div>
                                      </li>
                                    ))}
                                  </ul>
                                </TabsContent>
                                
                                <TabsContent value="supplements">
                                  <ul className="space-y-3">
                                    {results.recommendations.supplements.map((supplement: any, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="min-w-4 mt-1">•</div>
                                        <div>
                                          <span className="font-medium">{supplement.name}</span> — {supplement.dosage}
                                          <p className="text-sm text-gray-600 mt-1">{supplement.reason}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </TabsContent>
                                
                                <TabsContent value="medical">
                                  <ul className="space-y-2">
                                    {results.recommendations.medical.map((item: string, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="min-w-4 mt-1">•</div>
                                        <div>{item}</div>
                                      </li>
                                    ))}
                                  </ul>
                                </TabsContent>
                              </Tabs>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-3">Персональный план здоровья</h3>
                              <div className="space-y-4">
                                <div className="p-4 border rounded-lg">
                                  <h4 className="font-medium mb-2">Краткосрочные цели (3-6 месяцев)</h4>
                                  <p>{results.healthPlan.shortTerm}</p>
                                </div>
                                
                                <div className="p-4 border rounded-lg">
                                  <h4 className="font-medium mb-2">Среднесрочные цели (6-12 месяцев)</h4>
                                  <p>{results.healthPlan.mediumTerm}</p>
                                </div>
                                
                                <div className="p-4 border rounded-lg">
                                  <h4 className="font-medium mb-2">Долгосрочные цели (1-5 лет)</h4>
                                  <p>{results.healthPlan.longTerm}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Важно:</span> Этот анализ предоставляет общие рекомендации на основе 
                                введенных вами данных и не заменяет консультацию с квалифицированным врачом. 
                                Всегда консультируйтесь с медицинским специалистом перед внесением значительных 
                                изменений в ваш рацион, программу физических упражнений или режим приема добавок.
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                      
                      <CardFooter>
                        <Button variant="outline" onClick={() => setActiveTab("input")}>
                          Вернуться к вводу данных
                        </Button>
                      </CardFooter>
                    </TabsContent>
                  </Tabs>
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

export default ComprehensiveAnalysis;
