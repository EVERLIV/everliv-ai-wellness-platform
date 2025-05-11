
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
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface ApiKeyFormValues {
  apiKey: string;
}

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
  const [hasApiKey, setHasApiKey] = useState(false);

  // Проверяем наличие API ключа при загрузке компонента
  useEffect(() => {
    const apiKey = localStorage.getItem('OPENAI_API_KEY');
    setHasApiKey(!!apiKey);
  }, []);

  const form = useForm<ApiKeyFormValues>({
    defaultValues: {
      apiKey: ''
    }
  });

  const onSubmit = (values: ApiKeyFormValues) => {
    if (values.apiKey.trim()) {
      localStorage.setItem('OPENAI_API_KEY', values.apiKey.trim());
      setHasApiKey(true);
      toast.success("API ключ OpenAI успешно сохранен");
      setShowApiKeyForm(false);
      form.reset();
    } else {
      toast.error("Пожалуйста, введите API ключ");
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
                <div className="flex items-center gap-3 mb-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowApiKeyForm(!showApiKeyForm)}
                  >
                    {showApiKeyForm ? "Скрыть форму API ключа" : "Настроить API ключ OpenAI"}
                  </Button>
                  {hasApiKey && (
                    <span className="text-sm text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      API ключ настроен
                    </span>
                  )}
                </div>
                
                {showApiKeyForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Настройка API ключа OpenAI</CardTitle>
                      <CardDescription>
                        Введите ваш API ключ OpenAI для использования функций анализа
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormItem>
                          <FormLabel htmlFor="apiKey">API ключ OpenAI</FormLabel>
                          <FormDescription>
                            Вы можете получить API ключ на сайте <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI</a>
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...form.register('apiKey')}
                              type="password" 
                              id="apiKey"
                              placeholder="sk-..."
                              className="w-full"
                            />
                          </FormControl>
                        </FormItem>
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
