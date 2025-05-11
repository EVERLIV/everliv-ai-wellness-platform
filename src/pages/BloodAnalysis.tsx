
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TestTube } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FEATURES } from "@/constants/subscription-features";
import FeatureAccess from "@/components/FeatureAccess";
import BloodAnalysisForm from "@/components/blood-analysis/BloodAnalysisForm";
import BloodAnalysisResults from "@/components/blood-analysis/BloodAnalysisResults";
import { useBloodAnalysis } from "@/hooks/useBloodAnalysis";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const BloodAnalysis = () => {
  const {
    results,
    isAnalyzing,
    activeTab,
    apiError,
    setActiveTab,
    analyzeBloodTest
  } = useBloodAnalysis();
  
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('OPENAI_API_KEY', apiKey.trim());
      toast.success("API ключ OpenAI был сохранен");
      setShowApiKeyForm(false);
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

              {/* API Key Form */}
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApiKeyForm(!showApiKeyForm)}
                  className="mb-2"
                >
                  {showApiKeyForm ? "Скрыть форму API ключа" : "Настроить API ключ OpenAI"}
                </Button>
                
                {showApiKeyForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Настройка API ключа OpenAI</CardTitle>
                      <CardDescription>
                        Введите ваш API ключ OpenAI для использования функций анализа
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleApiKeySubmit} className="space-y-4">
                        <div>
                          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                            API ключ OpenAI
                          </label>
                          <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="sk-..."
                          />
                        </div>
                        <Button type="submit">Сохранить ключ</Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
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
                      <TabsTrigger value="results" disabled={!results}>Результаты</TabsTrigger>
                    </TabsList>
                    <TabsContent value="input">
                      <CardContent>
                        <BloodAnalysisForm 
                          onAnalyze={analyzeBloodTest}
                          isAnalyzing={isAnalyzing}
                        />
                      </CardContent>
                    </TabsContent>
                    <TabsContent value="results">
                      <CardContent>
                        <BloodAnalysisResults 
                          results={results}
                          isAnalyzing={isAnalyzing}
                          apiError={apiError}
                          onBack={() => setActiveTab("input")}
                        />
                      </CardContent>
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
