
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkAdminAccess } from "./admin-security";

export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  subscription_type?: string;
  subscription_expires_at?: string;
  subscription_id?: string;
  subscription_status?: string;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    // Получаем профили пользователей
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, created_at');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw new Error("Ошибка загрузки профилей пользователей");
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Получаем email адреса из auth.users через admin API
    const { data: authUsersResponse, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      // Если не удается получить email из auth, продолжаем с временными
    }

    const authUsers = authUsersResponse?.users || [];

    // Получаем подписки
    const userIds = profiles.map(profile => profile.id);
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('user_id, id, plan_type, expires_at, status')
      .in('user_id', userIds);

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
    }

    // Создаем карту email адресов для быстрого поиска
    const emailMap = new Map<string, string>();
    authUsers.forEach(user => {
      if (user.id && user.email) {
        emailMap.set(user.id, user.email);
      }
    });

    // Объединяем данные
    const users: AdminUser[] = profiles.map(profile => {
      const userSubscriptions = subscriptions?.filter(sub => sub.user_id === profile.id) || [];
      const subscription = userSubscriptions.length > 0 ? userSubscriptions[0] : null;
      const email = emailMap.get(profile.id) || `user-${profile.id.substring(0, 8)}@domain.com`;
      
      return {
        id: profile.id,
        email: email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        created_at: profile.created_at,
        subscription_type: subscription?.plan_type,
        subscription_expires_at: subscription?.expires_at,
        subscription_id: subscription?.id,
        subscription_status: subscription?.status
      };
    });

    return users;
  } catch (error) {
    console.error('Error in fetchAdminUsers:', error);
    if (error instanceof Error) {
      toast.error(error.message);
      throw error;
    }
    throw new Error("Неизвестная ошибка при загрузке пользователей");
  }
}

export async function updateUserProfile(
  userId: string, 
  updates: { first_name: string; last_name: string }
): Promise<boolean> {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      toast.error("Ошибка обновления профиля пользователя");
      return false;
    }

    toast.success("Профиль пользователя обновлен");
    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return false;
  }
}
