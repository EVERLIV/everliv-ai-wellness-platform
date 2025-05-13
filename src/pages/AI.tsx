
import React from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileBarChart, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AI = () => {
  return (
    <PageLayout
      title="Рекомендации искусственного интеллекта"
      description="Получите персонализированные рекомендации на основе ваших данных здоровья"
      breadcrumbItems={[
        { title: "Главная", href: "/" },
        { title: "Рекомендации ИИ" },
      ]}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 mr-2 text-everliv-600" />
              <h2 className="text-xl font-medium">Персонализированные рекомендации</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Наш искусственный интеллект анализирует ваши данные здоровья и генерирует 
              персонализированные рекомендации, которые помогут вам улучшить ваше самочувствие
              и достичь ваших целей в области здоровья.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/blood-analysis" className="block">
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <FileBarChart className="h-5 w-5 mr-2 text-everliv-600" />
                    <span>Анализ крови</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/recommendations" className="block">
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-everliv-600" />
                    <span>Рекомендации по здоровью</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AI;
