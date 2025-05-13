import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, History, Calendar, Settings } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSummary from "@/components/profile/ProfileSummary";
import AnalysisHistoryList from "@/components/profile/AnalysisHistoryList";
import { useProfile } from "@/hooks/useProfile";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { profileData, isLoading, isUpdating, updateProfile } = useProfile();
  const { history, isLoading: isHistoryLoading } = useAnalysisHistory();
  const { isAdmin } = useIsAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="bg-white border-b border-gray-200 my-[20px]">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Профиль пользователя</h1>
            <div className="flex gap-2">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="default" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Панель администратора
                  </Button>
                </Link>
              )}
              <Link to="/my-protocols">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Мои протоколы
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Назад к дашборду
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6 mb-10">
          <ProfileSummary profileData={profileData} isLoading={isLoading} />
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Профиль здоровья
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                История анализов
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-0 space-y-6">
              <ProfileForm 
                profileData={profileData}
                isLoading={isLoading}
                isUpdating={isUpdating}
                onUpdateProfile={updateProfile}
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <AnalysisHistoryList history={history} isLoading={isHistoryLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
