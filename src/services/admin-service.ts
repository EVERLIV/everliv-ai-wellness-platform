
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";

// Типы для пользователей
export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  subscription_status?: string;
  subscription_type?: string;
  subscription_id?: string;
  subscription_expires_at?: string;
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
      const subscription = subscriptions?.find(s => s.user_id === user.id && s.status === 'active');
      
      return {
        id: user.id,
        email: user.email || "",
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        created_at: user.created_at,
        subscription_status: subscription?.status,
        subscription_type: subscription?.plan_type,
        subscription_id: subscription?.id,
        subscription_expires_at: subscription?.expires_at
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

// Новые функции для управления подписками

export const assignSubscriptionToUser = async (
  userId: string, 
  planType: SubscriptionPlan, 
  expiresAt?: string
): Promise<boolean> => {
  try {
    // Проверяем, является ли текущий пользователь администратором
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id
    });

    if (adminCheckError || !isAdmin) {
      throw new Error("У вас нет прав администратора");
    }
    
    // Проверяем, есть ли уже активная подписка у пользователя
    const { data: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    // Если есть активная подписка, отменяем ее
    if (activeSubscriptions && activeSubscriptions.length > 0) {
      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' as SubscriptionStatus })
        .eq('id', activeSubscriptions[0].id);
      
      if (cancelError) throw cancelError;
    }
    
    // Определяем срок действия подписки (месяц от текущей даты, если не указано)
    const expDate = expiresAt ? new Date(expiresAt) : new Date();
    if (!expiresAt) {
      expDate.setMonth(expDate.getMonth() + 1);
    }
    
    // Добавляем новую подписку
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'active' as SubscriptionStatus,
        started_at: new Date().toISOString(),
        expires_at: expDate.toISOString()
      });
    
    if (insertError) throw insertError;
    
    toast.success(`Подписка ${planType} успешно назначена пользователю`);
    return true;
  } catch (error) {
    console.error("Error assigning subscription:", error);
    toast.error("Ошибка при назначении подписки");
    return false;
  }
};

export const cancelUserSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    // Проверяем, является ли текущий пользователь администратором
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id
    });

    if (adminCheckError || !isAdmin) {
      throw new Error("У вас нет прав администратора");
    }
    
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' as SubscriptionStatus })
      .eq('id', subscriptionId);
    
    if (error) throw error;
    
    toast.success("Подписка пользователя отменена");
    return true;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    toast.error("Ошибка при отмене подписки");
    return false;
  }
};

// Вспомогательная функция для преобразования Json в PlanFeatureDetail[]
const convertJsonToFeatures = (features: Json): PlanFeatureDetail[] => {
  if (!features) return [];
  
  // Если features это массив объектов
  if (Array.isArray(features)) {
    // Используем явное приведение типов с проверкой структуры
    return features.map(item => {
      // Проверяем, что элемент содержит нужные поля
      if (typeof item === 'object' && item !== null && 'name' in item && 'description' in item) {
        return {
          name: String(item.name),
          description: String(item.description)
        };
      }
      // Если структура не соответствует, возвращаем пустой объект
      return { name: "", description: "" };
    });
  }
  
  try {
    // Если features это строка JSON, попробуем распарсить
    if (typeof features === 'string') {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          name: String(item.name || ""),
          description: String(item.description || "")
        }));
      }
    }
  } catch (e) {
    console.error("Failed to parse features JSON:", e);
  }
  
  return [];
};

// Вспомогательная функция для преобразования PlanFeatureDetail[] в Json
const convertFeaturesToJson = (features: PlanFeatureDetail[]): Json => {
  // Используем "as unknown as" для безопасного преобразования типов
  // PlanFeatureDetail[] -> unknown -> Json
  return features as unknown as Json;
};

export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price');

    if (error) throw error;
    
    // Преобразуем данные из базы в формат SubscriptionPlan
    return (data || []).map(plan => ({
      ...plan,
      features: convertJsonToFeatures(plan.features)
    }));
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    toast.error("Ошибка при загрузке тарифных планов");
    return [];
  }
};

export const createSubscriptionPlan = async (plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan | null> => {
  try {
    // Преобразуем features в формат JSON для базы данных
    const planToInsert = {
      ...plan,
      features: convertFeaturesToJson(plan.features)
    };
    
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(planToInsert)
      .select()
      .single();

    if (error) throw error;
    toast.success("Тарифный план создан");
    
    // Преобразуем полученный результат обратно в формат SubscriptionPlan
    return {
      ...data,
      features: convertJsonToFeatures(data.features)
    };
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    toast.error("Ошибка при создании тарифного плана");
    return null;
  }
};

export const updateSubscriptionPlan = async (id: string, plan: Partial<SubscriptionPlan>): Promise<boolean> => {
  try {
    // Если есть features, преобразуем их в формат JSON для базы данных
    const planToUpdate = {
      ...plan,
      features: plan.features ? convertFeaturesToJson(plan.features) : undefined,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('subscription_plans')
      .update(planToUpdate)
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
