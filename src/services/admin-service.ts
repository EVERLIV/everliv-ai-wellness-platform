
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Типы для пользователей
export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  subscription_status?: string;
  subscription_type?: string;
}

// Типы для тарифов
export interface SubscriptionPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  features: PlanFeatureDetail[];
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanFeatureDetail {
  name: string;
  description: string;
}

// Функции для работы с пользователями
export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    // Проверяем, является ли текущий пользователь администратором
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id
    });

    if (adminCheckError || !isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    // Получаем список всех пользователей
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    // Получаем данные профилей пользователей
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) throw profilesError;

    // Получаем данные подписок пользователей
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*');
      
    if (subscriptionsError) throw subscriptionsError;

    // Объединяем данные
    return users.users.map(user => {
      const profile = profiles.find(p => p.id === user.id);
      const subscription = subscriptions?.find(s => s.user_id === user.id);
      
      return {
        id: user.id,
        email: user.email || "",
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        created_at: user.created_at,
        subscription_status: subscription?.status,
        subscription_type: subscription?.plan_type
      };
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    toast.error("Ошибка при загрузке пользователей");
    return [];
  }
};

export const updateUserProfile = async (userId: string, data: { first_name?: string; last_name?: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (error) throw error;
    toast.success("Профиль пользователя обновлен");
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    toast.error("Ошибка при обновлении профиля пользователя");
    return false;
  }
};

// Функции для работы с тарифами
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    toast.error("Ошибка при загрузке тарифных планов");
    return [];
  }
};

export const createSubscriptionPlan = async (plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    toast.success("Тарифный план создан");
    return data;
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    toast.error("Ошибка при создании тарифного плана");
    return null;
  }
};

export const updateSubscriptionPlan = async (id: string, plan: Partial<SubscriptionPlan>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscription_plans')
      .update({
        ...plan,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    toast.success("Тарифный план обновлен");
    return true;
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    toast.error("Ошибка при обновлении тарифного плана");
    return false;
  }
};

export const deleteSubscriptionPlan = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success("Тарифный план удален");
    return true;
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    toast.error("Ошибка при удалении тарифного плана");
    return false;
  }
};
