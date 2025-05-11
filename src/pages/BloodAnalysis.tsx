
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, TestTube, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { Skeleton } from "@/components/ui/skeleton";

const BloodAnalysis = () => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial } = useSubscription();
  const [bloodText, setBloodText] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const canUseBloodAnalysis = canUseFeature(FEATURES.BLOOD_ANALYSIS);

  const handleAnalyze = async () => {
    if (!bloodText.trim()) {
      toast.error("Пожалуйста, введите результаты анализа крови");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Record feature trial
      if (user && canUseBloodAnalysis) {
        await recordFeatureTrial(FEATURES.BLOOD_ANALYSIS);
      }

      // Mock analysis for now - we'd replace with actual API call
      setTimeout(() => {
        const mockResults = {
          markers: [
            { name: "Гемоглобин", value: "142 г/л", normalRange: "130-160 г/л", status: "normal", recommendation: "В пределах нормы" },
            { name: "Эритроциты", value: "4.7 млн/мкл", normalRange: "4.5-5.5 млн/мкл", status: "normal", recommendation: "В пределах нормы" },
            { name: "Лейкоциты", value: "10.2 тыс/мкл", normalRange: "4.0-9.0 тыс/мкл", status: "high", recommendation: "Повышен. Может указывать на наличие инфекции или воспаления в организме." },
            { name: "Тромбоциты", value: "220 тыс/мкл", normalRange: "150-400 тыс/мкл", status: "normal", recommendation: "В пределах нормы" },
            { name: "Холестерин общий", value: "6.2 ммоль/л", normalRange: "до 5.2 ммоль/л", status: "high", recommendation: "Повышен. Рекомендуется корректировка диеты с уменьшением потребления животных жиров." },
          ],
          supplements: [
            { name: "Омега-3", reason: "Для улучшения липидного профиля и снижения холестерина" },
            { name: "Витамин С", reason: "Для поддержки иммунной системы при повышенных лейкоцитах" },
            { name: "Коэнзим Q10", reason: "Для поддержки сердечно-сосудистой системы" },
          ],
          generalRecommendation: "На основе анализа крови рекомендуется обратить внимание на повышенный уровень холестерина и лейкоцитов. Следует включить в рацион больше свежих овощей, фруктов, омега-3 жирных кислот, и уменьшить потребление животных жиров. При сохранении повышенных лейкоцитов в течение более 2 недель рекомендуется консультация терапевта."
        };

        setAnalysisResults(mockResults);
        setActiveTab("results");
        toast.success("Анализ успешно завершен");
      }, 2000);
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
                <TestTube className="h-8 w-8 text-everliv-600" />
                <h1 className="text-3xl md:text-4xl font-bold">Анализ крови и биомаркеров</h1>
              </div>

              {!user ? (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Требуется авторизация</AlertTitle>
                  <AlertDescription>
                    Для использования функции анализа крови необходимо авторизоваться
                  </AlertDescription>
                </Alert>
              ) : !canUseBloodAnalysis ? (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Функция недоступна</AlertTitle>
                  <AlertDescription>
                    Вы уже использовали бесплатную пробную версию анализа крови. Для продолжения оформите подписку.
                  </AlertDescription>
                </Alert>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>AI анализ результатов крови</CardTitle>
                    <CardDescription>
                      Загрузите результаты вашего анализа крови для получения персонализированных рекомендаций
                    </CardDescription>
                  </CardHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mx-6">
                      <TabsTrigger value="input">Ввод данных</TabsTrigger>
                      <TabsTrigger value="results" disabled={!analysisResults}>Результаты</TabsTrigger>
                    </TabsList>
                    <TabsContent value="input">
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2 text-sm text-gray-500">
                              Введите результаты вашего анализа крови в свободной форме или скопируйте из файла
                            </p>
                            <Textarea 
                              placeholder="Например: Гемоглобин: 142 г/л, Эритроциты: 4.7 млн/мкл, Лейкоциты: 10.2 тыс/мкл..."
                              value={bloodText}
                              onChange={(e) => setBloodText(e.target.value)}
                              rows={10}
                              className="resize-none"
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={handleAnalyze} 
                          disabled={!canUseBloodAnalysis || isAnalyzing || !bloodText.trim()}
                        >
                          {isAnalyzing ? "Анализируем..." : "Анализировать"}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                    <TabsContent value="results">
                      <CardContent>
                        {isAnalyzing ? (
                          <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ) : analysisResults ? (
                          <div className="space-y-6">
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
                                  {analysisResults.markers.map((marker: any) => (
                                    <TableRow key={marker.name}>
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
                              <h3 className="text-lg font-medium mb-3">Рекомендуемые добавки</h3>
                              <ul className="space-y-2">
                                {analysisResults.supplements.map((supplement: any) => (
                                  <li key={supplement.name} className="flex items-start gap-2">
                                    <div className="min-w-4 mt-1">•</div>
                                    <div>
                                      <span className="font-medium">{supplement.name}</span> — {supplement.reason}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">Общие рекомендации</h3>
                              <p className="text-gray-700">{analysisResults.generalRecommendation}</p>
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
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BloodAnalysis;
