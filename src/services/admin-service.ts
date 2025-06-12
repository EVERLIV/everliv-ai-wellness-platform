
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Проверка прав администратора
export async function checkAdminAccess(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Пользователь не авторизован");
  }

  const { data, error } = await supabase.rpc('is_admin', { 
    user_uuid: user.id 
  });
  
  if (error) {
    console.error('Error checking admin status:', error);
    throw new Error("Ошибка проверки прав администратора");
  }
  
  return !!data;
}

export interface PlanFeatureDetail {
  name: string;
  description: string;
}

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

export interface AdminSubscriptionPlan {
  id: string;
  type: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeatureDetail[];
  limits: any;
  is_active: boolean;
  is_popular: boolean;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    // Проверяем права администратора
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    // Получаем пользователей с их профилями
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

    // Получаем подписки отдельно
    const userIds = profiles.map(profile => profile.id);
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('user_id, id, plan_type, expires_at, status')
      .in('user_id', userIds);

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
    }

    // Получаем emails пользователей
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw new Error("Ошибка получения данных пользователей");
    }

    // Объединяем данные
    const users: AdminUser[] = profiles.map(profile => {
      const authUser = authUsers?.users?.find(u => u.id === profile.id);
      const userSubscriptions = subscriptions?.filter(sub => sub.user_id === profile.id) || [];
      const subscription = userSubscriptions.length > 0 ? userSubscriptions[0] : null;
      
      return {
        id: profile.id,
        email: authUser?.email || 'Неизвестно',
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

export async function assignSubscriptionToUser(
  userId: string,
  planType: string,
  expiresAt: string
): Promise<boolean> {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        expires_at: expiresAt,
        started_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error assigning subscription:', error);
      toast.error("Ошибка назначения подписки");
      return false;
    }

    toast.success("Подписка назначена пользователю");
    return true;
  } catch (error) {
    console.error('Error in assignSubscriptionToUser:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return false;
  }
}

export async function cancelUserSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId);

    if (error) {
      console.error('Error canceling subscription:', error);
      toast.error("Ошибка отмены подписки");
      return false;
    }

    toast.success("Подписка отменена");
    return true;
  } catch (error) {
    console.error('Error in cancelUserSubscription:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return false;
  }
}

export async function fetchSubscriptionPlans(): Promise<AdminSubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error("Ошибка загрузки тарифных планов");
    }

    // Convert database data to our TypeScript interface
    const plans: AdminSubscriptionPlan[] = (data || []).map(plan => ({
      id: plan.id,
      type: plan.type,
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: Array.isArray(plan.features) ? (plan.features as unknown as PlanFeatureDetail[]) : [],
      limits: plan.limits,
      is_active: plan.is_active,
      is_popular: plan.is_popular
    }));

    return plans;
  } catch (error) {
    console.error('Error in fetchSubscriptionPlans:', error);
    throw error;
  }
}

export async function createSubscriptionPlan(planData: Omit<AdminSubscriptionPlan, 'id'>): Promise<AdminSubscriptionPlan | null> {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    // Convert features to Json format for database
    const dbPlanData = {
      type: planData.type,
      name: planData.name,
      price: planData.price,
      description: planData.description,
      features: planData.features as any, // Cast to Json
      limits: planData.limits,
      is_active: planData.is_active,
      is_popular: planData.is_popular
    };

    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(dbPlanData)
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription plan:', error);
      toast.error("Ошибка создания тарифного плана");
      return null;
    }

    // Convert back to our TypeScript interface
    const result: AdminSubscriptionPlan = {
      id: data.id,
      type: data.type,
      name: data.name,
      price: data.price,
      description: data.description,
      features: Array.isArray(data.features) ? (data.features as unknown as PlanFeatureDetail[]) : [],
      limits: data.limits,
      is_active: data.is_active,
      is_popular: data.is_popular
    };

    toast.success("Тарифный план создан");
    return result;
  } catch (error) {
    console.error('Error in createSubscriptionPlan:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return null;
  }
}

export async function updateSubscriptionPlan(planId: string, updates: Partial<AdminSubscriptionPlan>): Promise<boolean> {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    // Convert updates to database format
    const dbUpdates: any = { ...updates };
    if (dbUpdates.features) {
      dbUpdates.features = dbUpdates.features as any; // Cast to Json
    }

    const { error } = await supabase
      .from('subscription_plans')
      .update(dbUpdates)
      .eq('id', planId);

    if (error) {
      console.error('Error updating subscription plan:', error);
      toast.error("Ошибка обновления тарифного плана");
      return false;
    }

    toast.success("Тарифный план обновлен");
    return true;
  } catch (error) {
    console.error('Error in updateSubscriptionPlan:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return false;
  }
}

export async function deleteSubscriptionPlan(planId: string): Promise<boolean> {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', planId);

    if (error) {
      console.error('Error deleting subscription plan:', error);
      toast.error("Ошибка удаления тарифного плана");
      return false;
    }

    toast.success("Тарифный план удален");
    return true;
  } catch (error) {
    console.error('Error in deleteSubscriptionPlan:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return false;
  }
}
