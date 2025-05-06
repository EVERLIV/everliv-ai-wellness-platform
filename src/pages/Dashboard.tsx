
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  medical_conditions: string[] | null;
  allergies: string[] | null;
  medications: string[] | null;
  goals: string[] | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data as Profile);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Персональная панель</h1>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => signOut()}
              >
                Выйти
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-evergreen-500"></div>
              </div>
            ) : (
              <div>
                <div className="mb-6 p-4 bg-evergreen-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-evergreen-700 mb-2">Добро пожаловать, {profile?.first_name || user?.email}</h2>
                  <p className="text-gray-600">Здесь вы можете управлять своим профилем здоровья и отслеживать прогресс.</p>
                </div>
                
                {/* Profile section - placeholder for future functionality */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Ваш профиль</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-500">Имя и фамилия</p>
                      <p className="font-medium">{profile?.first_name} {profile?.last_name || 'Не указано'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Placeholder for future functionality */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Здоровье', 'Питание', 'Активность', 'Сон', 'Ментальное здоровье', 'Анализы'].map((category) => (
                    <div key={category} className="bg-white border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium mb-2">{category}</h4>
                      <p className="text-sm text-gray-600 mb-3">Данные будут доступны скоро</p>
                      <Button variant="outline" size="sm" className="w-full">Настроить</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
