
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const alfaBankApiSecret = Deno.env.get("ALFA_BANK_API_SECRET") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Получаем данные от платежной системы
    const payload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload));

    // Проверка подписи запроса (в реальной интеграции)
    // const signature = req.headers.get("X-Alfa-Signature");
    // if (!verifySignature(payload, signature, alfaBankApiSecret)) {
    //   return new Response(
    //     JSON.stringify({ error: "Invalid signature" }),
    //     { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    //   );
    // }

    // Извлекаем идентификатор платежа и статус
    const { orderId, status } = payload;
    
    // Находим платеж в базе данных
    const { data: paymentData, error: paymentError } = await supabase
      .from("payment_sessions")
      .select("*")
      .eq("id", orderId)
      .single();

    if (paymentError || !paymentData) {
      console.error("Payment not found:", orderId);
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Обновляем статус платежа в базе данных
    await supabase
      .from("payment_sessions")
      .update({ status: mapAlfaBankStatusToInternal(status) })
      .eq("id", orderId);

    // Если платеж успешен, создаем или обновляем подписку пользователя
    if (status === "APPROVED" || status === "DEPOSITED") {
      const userId = paymentData.user_id;
      const planType = paymentData.plan_type;
      const isUpgrade = paymentData.metadata?.is_upgrade;
      const fromPlan = paymentData.metadata?.from_plan;

      // Если это апгрейд, отменяем текущую подписку
      if (isUpgrade) {
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("user_id", userId)
          .eq("status", "active")
          .eq("plan_type", fromPlan);
      }

      // Вычисляем дату окончания подписки (1 месяц от текущей даты)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      // Создаем новую подписку
      await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan_type: planType,
          status: "active",
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_id: orderId
        });
    }

    // Отправляем подтверждение о получении webhook
    return new Response(
      JSON.stringify({ result: "OK" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Функция для маппинга статусов Альфа-Банка в внутренние статусы
function mapAlfaBankStatusToInternal(status: string): string {
  switch (status) {
    case "CREATED":
      return "pending";
    case "APPROVED":
    case "DEPOSITED":
      return "completed";
    case "DECLINED":
    case "REVERSED":
      return "failed";
    case "REFUNDED":
      return "refunded";
    default:
      return "pending";
  }
}

// Функция для проверки подписи (в реальной интеграции)
function verifySignature(payload: any, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  // Здесь должна быть реализация проверки подписи, 
  // согласно документации Альфа-Банка
  return true;
}
