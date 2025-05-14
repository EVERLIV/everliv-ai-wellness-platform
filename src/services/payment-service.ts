
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/types/subscription";

// Типы для платежей
interface PaymentSession {
  id: string;
  status: "pending" | "completed" | "failed" | "canceled";
  amount: number;
  currency: string;
  created_at: string;
  payment_url: string;
  metadata: Record<string, any>;
}

interface CreatePaymentSessionParams {
  planType: SubscriptionPlan;
  amount: number;
  currency?: string;
  userId: string;
  promoCode?: string;
  isUpgrade?: boolean;
  fromPlan?: string;
}

// Создание платежной сессии через Edge Function
export const createPaymentSession = async (params: CreatePaymentSessionParams): Promise<PaymentSession | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-session', {
      body: {
        planType: params.planType,
        amount: params.amount,
        currency: params.currency || 'RUB',
        userId: params.userId,
        promoCode: params.promoCode,
        isUpgrade: params.isUpgrade,
        fromPlan: params.fromPlan
      }
    });
    
    if (error) throw error;
    
    return data as PaymentSession;
  } catch (error) {
    console.error("Error creating payment session:", error);
    toast.error("Не удалось создать платежную сессию");
    return null;
  }
};

// Проверка статуса платежа
export const checkPaymentStatus = async (paymentId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-payment-status', {
      body: { paymentId }
    });
    
    if (error) throw error;
    
    return data?.status || null;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return null;
  }
};

// Применить промокод
export const applyPromoCode = async (code: string): Promise<{valid: boolean; discount: number; message: string}> => {
  try {
    const { data, error } = await supabase.functions.invoke('apply-promo-code', {
      body: { code }
    });
    
    if (error) throw error;
    
    return data as {valid: boolean; discount: number; message: string};
  } catch (error) {
    console.error("Error applying promo code:", error);
    return {valid: false, discount: 0, message: "Ошибка при проверке промокода"};
  }
};

// Отменить платеж
export const cancelPayment = async (paymentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('cancel-payment', {
      body: { paymentId }
    });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error canceling payment:", error);
    return false;
  }
};
