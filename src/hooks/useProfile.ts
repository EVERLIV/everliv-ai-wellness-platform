
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  date_of_birth: string | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  medical_conditions: string[] | null;
  allergies: string[] | null;
  medications: string[] | null;
  goals: string[] | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Загружаем профиль для пользователя:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Профиль не найден, создаем новый
          console.log('Профиль не найден, создаем новый');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              nickname: user.user_metadata?.nickname || user.user_metadata?.full_name || '',
              first_name: user.user_metadata?.full_name || ''
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            return;
          }

          console.log('Профиль создан:', newProfile);
          setProfileData(newProfile as ProfileData);
        } else {
          console.error("Error fetching profile:", error);
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить данные профиля",
            variant: "destructive"
          });
        }
        return;
      }

      console.log('Профиль загружен:', data);
      setProfileData(data as ProfileData);
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при загрузке профиля",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<Omit<ProfileData, 'id'>>) => {
    if (!user) {
      console.error('Нет пользователя для обновления профиля');
      return false;
    }

    try {
      setIsUpdating(true);
      console.log('Обновляем профиль:', updatedData);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить профиль",
          variant: "destructive"
        });
        return false;
      }

      console.log('Профиль обновлен:', data);
      // Update local state with new data from server
      setProfileData(data as ProfileData);
      
      toast({
        title: "Успешно",
        description: "Профиль успешно обновлен"
      });
      return true;
    } catch (error) {
      console.error("Unexpected error updating profile:", error);
      toast({
        title: "Ошибка", 
        description: "Произошла ошибка при обновлении профиля",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfileData(null);
    }
  }, [user]);

  return {
    profileData,
    isLoading,
    isUpdating,
    fetchProfile,
    updateProfile
  };
};
