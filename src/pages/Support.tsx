
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SupportOptions from "@/components/support/SupportOptions";
import SupportContactForm from "@/components/support/SupportContactForm";
import SupportFAQ from "@/components/support/SupportFAQ";

const Support: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Поддержка</h1>
          </div>

          <div className="grid gap-6">
            <SupportOptions />
            <SupportContactForm />
            <SupportFAQ />
          </div>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default Support;
