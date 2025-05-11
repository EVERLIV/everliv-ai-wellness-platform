
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProfileData {
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

export const useProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Не удалось загрузить данные профиля");
        return;
      }

      setProfileData(data);
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      toast.error("Произошла ошибка при загрузке профиля");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<Omit<ProfileData, 'id'>>) => {
    if (!user) return;

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Не удалось обновить профиль");
        return false;
      }

      // Update local state with new data
      setProfileData(prev => prev ? { ...prev, ...updatedData } : null);
      toast.success("Профиль успешно обновлен");
      return true;
    } catch (error) {
      console.error("Unexpected error updating profile:", error);
      toast.error("Произошла ошибка при обновлении профиля");
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
