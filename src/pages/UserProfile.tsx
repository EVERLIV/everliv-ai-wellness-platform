
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from '@/components/profile/ProfileForm';
import AnalysisHistoryList from '@/components/profile/AnalysisHistoryList';
import NewsletterSubscription from '@/components/newsletter/NewsletterSubscription';
import { User, FileText, Mail, Settings } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { history, isLoading: historyLoading } = useAnalysisHistory();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Профиль пользователя</h1>
          <p className="text-gray-600 mt-2">Управляйте своим профилем и настройками</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Анализы
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Личная информация</CardTitle>
                <CardDescription>
                  Обновите свою личную информацию и настройки профиля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm 
                  profileData={profile}
                  isLoading={profileLoading}
                  isUpdating={false}
                  onUpdateProfile={updateProfile}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>История анализов</CardTitle>
                <CardDescription>
                  Просмотрите историю ваших медицинских анализов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalysisHistoryList 
                  history={history || []}
                  isLoading={historyLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <NewsletterSubscription />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
                <CardDescription>
                  Управляйте настройками уведомлений и приватности
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Настройки будут добавлены в следующих обновлениях</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
