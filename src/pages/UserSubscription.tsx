
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SubscriptionManagement from "@/components/dashboard/SubscriptionManagement";
import PageHeader from "@/components/PageHeader";

const UserSubscription = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <PageHeader
          title="Управление подпиской"
          description="Выберите оптимальный тарифный план для вашего здоровья"
        />
        
        <div className="container mx-auto px-4 py-8 mb-12">
          <div className="flex justify-end mb-6">
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад в панель управления
              </Button>
            </Link>
          </div>
          
          <SubscriptionManagement />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserSubscription;
