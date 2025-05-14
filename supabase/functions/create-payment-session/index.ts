
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const alfaBankApiUrl = Deno.env.get("ALFA_BANK_API_URL") || "https://alfabank.ru/api";
const alfaBankApiKey = Deno.env.get("ALFA_BANK_API_KEY") || "";
const alfaBankUsername = Deno.env.get("ALFA_BANK_USERNAME") || "";
const alfaBankPassword = Deno.env.get("ALFA_BANK_PASSWORD") || "";
const appHost = Deno.env.get("APP_HOST") || "https://app.everliv.ru";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const { planType, amount, currency, userId, promoCode, isUpgrade, fromPlan } = await req.json();

    // Проверка авторизации пользователя
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Отсутствует токен авторизации" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Извлекаем JWT токен из заголовка
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user || userData.user.id !== userId) {
      return new Response(
        JSON.stringify({ error: "Неверный токен авторизации" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Применяем промокод, если указан
    let finalAmount = amount;
    if (promoCode) {
      const { data: promoData, error: promoError } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode)
        .eq("is_active", true)
        .single();

      if (!promoError && promoData) {
        // Проверка на дату окончания действия промокода
        if (!promoData.expires_at || new Date(promoData.expires_at) > new Date()) {
          // Проверка на максимальное количество использований
          if (!promoData.max_uses || promoData.uses_count < promoData.max_uses) {
            // Применяем скидку
            finalAmount = Math.max(0, amount - (amount * promoData.discount_percent / 100));
            
            // Обновляем счетчик использований
            await supabase
              .from("promo_codes")
              .update({ uses_count: promoData.uses_count + 1 })
              .eq("id", promoData.id);
            
            // Записываем использование промокода
            await supabase
              .from("promo_code_uses")
              .insert({
                user_id: userId,
                promo_code_id: promoData.id,
                original_amount: amount,
                discounted_amount: finalAmount,
                plan_type: planType
              });
          }
        }
      }
    }

    // Создаем платежную сессию в Альфа-Банке
    const returnUrl = `${appHost}/payment/success`;
    const failUrl = `${appHost}/payment/fail`;
    const notificationUrl = `${supabaseUrl}/functions/v1/payment-webhook`;

    // Здесь идет интеграция с Альфа-Банком
    // В реальном коде здесь будет обращение к API Альфа-Банка
    // На данном этапе мы эмулируем ответ от API

    // Для реальной интеграции, например:
    // const alfaBankResponse = await fetch(`${alfaBankApiUrl}/register`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": "Basic " + btoa(`${alfaBankUsername}:${alfaBankPassword}`)
    //   },
    //   body: JSON.stringify({
    //     orderNumber: `${new Date().getTime()}-${userId}`,
    //     amount: finalAmount * 100, // в копейках
    //     returnUrl,
    //     failUrl,
    //     description: `Подписка ${planType}`,
    //     language: "ru",
    //     jsonParams: JSON.stringify({
    //       planType,
    //       userId,
    //       isUpgrade,
    //       fromPlan
    //     })
    //   })
    // });
    
    // const alfaBankData = await alfaBankResponse.json();

    // Эмуляция ответа от API Альфа-Банка
    const paymentId = crypto.randomUUID();
    const formUrl = `${appHost}/payment-emulator?id=${paymentId}&amount=${finalAmount}`;

    // Сохраняем информацию о платеже в базе данных
    const { data: paymentData, error: paymentError } = await supabase
      .from("payment_sessions")
      .insert({
        id: paymentId,
        user_id: userId,
        amount: finalAmount,
        currency,
        status: "pending",
        plan_type: planType,
        payment_url: formUrl,
        metadata: {
          original_amount: amount,
          promo_code: promoCode,
          is_upgrade: isUpgrade,
          from_plan: fromPlan
        }
      })
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    return new Response(
      JSON.stringify({
        id: paymentData.id,
        status: paymentData.status,
        amount: paymentData.amount,
        currency: paymentData.currency,
        created_at: paymentData.created_at,
        payment_url: paymentData.payment_url,
        metadata: paymentData.metadata
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при создании платежной сессии" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
