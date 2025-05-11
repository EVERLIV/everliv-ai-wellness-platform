
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
import { Brain, TestTube, Clock, AlertCircle, FileUpload } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { Skeleton } from "@/components/ui/skeleton";
import FeatureAccess from "@/components/FeatureAccess";

const BloodAnalysis = () => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial } = useSubscription();
  const [bloodText, setBloodText] = useState("");
  const [bloodPhotoUrl, setBloodPhotoUrl] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [selectedInputMethod, setSelectedInputMethod] = useState<"text" | "photo">("text");

  const canUseBloodAnalysis = canUseFeature(FEATURES.BLOOD_ANALYSIS);
  const canUsePhotoAnalysis = canUseFeature(FEATURES.PHOTO_BLOOD_ANALYSIS);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload to a server/storage here
      // For now, create a local URL to display the image
      const url = URL.createObjectURL(file);
      setBloodPhotoUrl(url);
      setSelectedInputMethod("photo");
      toast.success("Фото загружено");
    }
  };

  const handleAnalyze = async () => {
    if (selectedInputMethod === "text" && !bloodText.trim()) {
      toast.error("Пожалуйста, введите результаты анализа крови");
      return;
    }

    if (selectedInputMethod === "photo" && !bloodPhotoUrl) {
      toast.error("Пожалуйста, загрузите фото результатов анализа");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Record feature trial
      if (user) {
        if (selectedInputMethod === "text" && canUseBloodAnalysis) {
          await recordFeatureTrial(FEATURES.BLOOD_ANALYSIS);
        } else if (selectedInputMethod === "photo" && canUsePhotoAnalysis) {
          await recordFeatureTrial(FEATURES.PHOTO_BLOOD_ANALYSIS);
        }
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
            { name: "Омега-3", reason: "Для улучшения липидного профиля и снижения холестерина", dosage: "1000 мг ежедневно во время еды" },
            { name: "Витамин С", reason: "Для поддержки иммунной системы при повышенных лейкоцитах", dosage: "500 мг 2 раза в день" },
            { name: "Коэнзим Q10", reason: "Для поддержки сердечно-сосудистой системы", dosage: "100 мг ежедневно" },
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

              <FeatureAccess
                featureName={FEATURES.BLOOD_ANALYSIS}
                title="Анализ крови с помощью AI"
                description="Расшифровка результатов анализов крови с использованием искусственного интеллекта"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>AI анализ результатов крови</CardTitle>
                    <CardDescription>
                      Введите или загрузите фото результатов вашего анализа крови для получения персонализированных рекомендаций
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
                          <Tabs defaultValue={selectedInputMethod} onValueChange={(value) => setSelectedInputMethod(value as "text" | "photo")}>
                            <TabsList>
                              <TabsTrigger value="text">Ввод текста</TabsTrigger>
                              <TabsTrigger value="photo" disabled={!canUsePhotoAnalysis}>
                                Фото анализа
                                {!canUsePhotoAnalysis && <span className="ml-2 text-xs">(Требуется подписка)</span>}
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="text" className="pt-4">
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
                            </TabsContent>
                            
                            <TabsContent value="photo" className="pt-4">
                              <div className="space-y-4">
                                <div>
                                  <p className="mb-4 text-sm text-gray-500">
                                    Загрузите фото или скан вашего анализа крови для автоматического распознавания результатов с помощью AI
                                  </p>
                                  
                                  <div className="flex items-center gap-4">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => document.getElementById('bloodPhotoInput')?.click()}
                                      className="flex items-center gap-2"
                                    >
                                      <FileUpload className="h-4 w-4" />
                                      Загрузить фото
                                    </Button>
                                    <input
                                      id="bloodPhotoInput"
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePhotoUpload}
                                      className="hidden"
                                    />
                                  </div>
                                </div>
                                
                                {bloodPhotoUrl && (
                                  <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Загруженное фото:</p>
                                    <div className="border rounded-md p-2 bg-gray-50 max-w-sm">
                                      <img
                                        src={bloodPhotoUrl}
                                        alt="Загруженные результаты анализа"
                                        className="max-w-full rounded"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={handleAnalyze} 
                          disabled={isAnalyzing || (selectedInputMethod === "text" && !bloodText.trim()) || (selectedInputMethod === "photo" && !bloodPhotoUrl)}
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
                              <ul className="space-y-3">
                                {analysisResults.supplements.map((supplement: any) => (
                                  <li key={supplement.name} className="flex items-start gap-2">
                                    <div className="min-w-4 mt-1">•</div>
                                    <div>
                                      <span className="font-medium">{supplement.name}</span> — {supplement.reason}
                                      <div className="text-sm text-gray-600 mt-1">Дозировка: {supplement.dosage}</div>
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
              </FeatureAccess>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BloodAnalysis;
