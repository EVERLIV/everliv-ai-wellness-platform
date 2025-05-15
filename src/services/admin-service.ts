
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { SubscriptionPlan as UserSubscriptionPlan, SubscriptionStatus } from "@/types/subscription";

// Types for users
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

// Types for subscription plans
export interface AdminSubscriptionPlan {
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

// Functions for user management
export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    // Verify admin permissions
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id
    });

    if (adminCheckError || !isAdmin) {
      throw new Error("У вас нет прав администратора");
    }

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    // Get user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) throw profilesError;

    // Get user subscriptions - using raw query because type definition is not updated
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*') as unknown as { 
        data: Array<{ 
          id: string; 
          user_id: string; 
          plan_type: string; 
          status: string; 
          expires_at: string 
        }> | null; 
        error: Error | null 
      };
      
    if (subscriptionsError) throw subscriptionsError;

    // Merge data
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

// Functions for subscription management
export const assignSubscriptionToUser = async (
  userId: string, 
  planType: UserSubscriptionPlan, 
  expiresAt?: string
): Promise<boolean> => {
  try {
    // Verify admin permissions
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id
    });

    if (adminCheckError || !isAdmin) {
      throw new Error("У вас нет прав администратора");
    }
    
    // Check for existing active subscription - using raw query
    const { data: activeSubscriptions, error: queryError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active') as unknown as { 
        data: Array<{ id: string; user_id: string; status: string }> | null; 
        error: Error | null 
      };
    
    if (queryError) throw queryError;
    
    // Cancel existing subscription if present
    if (activeSubscriptions && activeSubscriptions.length > 0) {
      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('id', activeSubscriptions[0].id) as unknown as { error: Error | null };
      
      if (cancelError) throw cancelError;
    }
    
    // Set subscription expiration date
    const expDate = expiresAt ? new Date(expiresAt) : new Date();
    if (!expiresAt) {
      expDate.setMonth(expDate.getMonth() + 1);
    }
    
    // Add new subscription
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expDate.toISOString()
      }) as unknown as { error: Error | null };
    
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
    // Verify admin permissions
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id
    });

    if (adminCheckError || !isAdmin) {
      throw new Error("У вас нет прав администратора");
    }
    
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('id', subscriptionId) as unknown as { error: Error | null };
    
    if (error) throw error;
    
    toast.success("Подписка пользователя отменена");
    return true;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    toast.error("Ошибка при отмене подписки");
    return false;
  }
};

// Helper function to convert JSON to PlanFeatureDetail[]
const convertJsonToFeatures = (features: Json): PlanFeatureDetail[] => {
  if (!features) return [];
  
  // Handle array of objects
  if (Array.isArray(features)) {
    return features.map(item => {
      if (typeof item === 'object' && item !== null && 'name' in item && 'description' in item) {
        return {
          name: String(item.name),
          description: String(item.description)
        };
      }
      return { name: "", description: "" };
    });
  }
  
  // Handle JSON string
  try {
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

// Helper function to convert PlanFeatureDetail[] to Json
const convertFeaturesToJson = (features: PlanFeatureDetail[]): Json => {
  return features as unknown as Json;
};

// Subscription plan management functions
export const fetchSubscriptionPlans = async (): Promise<AdminSubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price') as unknown as { 
        data: Array<AdminSubscriptionPlan & { features: Json }> | null; 
        error: Error | null 
      };

    if (error) throw error;
    
    // Convert database records to AdminSubscriptionPlan format
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

export const createSubscriptionPlan = async (plan: Omit<AdminSubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<AdminSubscriptionPlan | null> => {
  try {
    // Convert features to JSON format for database
    const planToInsert = {
      ...plan,
      features: convertFeaturesToJson(plan.features)
    };
    
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(planToInsert)
      .select()
      .single() as unknown as { 
        data: AdminSubscriptionPlan & { features: Json } | null; 
        error: Error | null 
      };

    if (error) throw error;
    toast.success("Тарифный план создан");
    
    // Convert result back to AdminSubscriptionPlan format
    return data ? {
      ...data,
      features: convertJsonToFeatures(data.features)
    } : null;
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    toast.error("Ошибка при создании тарифного плана");
    return null;
  }
};

export const updateSubscriptionPlan = async (id: string, plan: Partial<AdminSubscriptionPlan>): Promise<boolean> => {
  try {
    // Convert features to JSON if present
    const planToUpdate = {
      ...plan,
      features: plan.features ? convertFeaturesToJson(plan.features) : undefined,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('subscription_plans')
      .update(planToUpdate)
      .eq('id', id) as unknown as { error: Error | null };

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
      .eq('id', id) as unknown as { error: Error | null };

    if (error) throw error;
    toast.success("Тарифный план удален");
    return true;
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    toast.error("Ошибка при удалении тарифного плана");
    return false;
  }
};
