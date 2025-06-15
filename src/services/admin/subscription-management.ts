
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkAdminAccess } from "./admin-security";

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
