
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/layout/AppSidebar';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import BiologicalAgeCalculator from '@/components/biological-age/BiologicalAgeCalculator';

const BiologicalAgePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <AppSidebar />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6">
              <div className="mb-4">
                <h1 className="text-xl font-medium mb-1 text-gray-900">
                  Определение биологического возраста
                </h1>
                <p className="text-sm text-gray-600">
                  Узнайте свой биологический возраст на основе комплексной оценки биомаркеров и показателей здоровья
                </p>
              </div>
              
              <BiologicalAgeCalculator />
            </div>
          </main>
        </div>
      </SidebarProvider>
      <MinimalFooter />
    </div>
  );
};

export default BiologicalAgePage;
