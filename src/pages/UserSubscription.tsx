
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SubscriptionManagement from "@/components/dashboard/SubscriptionManagement";

const UserSubscription = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Управление подпиской</h1>
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад в панель управления
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <SubscriptionManagement />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserSubscription;
