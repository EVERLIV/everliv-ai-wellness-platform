
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

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
    const { code } = await req.json();

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
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Неверный токен авторизации" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Получаем информацию о промокоде из базы данных
    const { data: promoData, error: promoError } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (promoError || !promoData) {
      return new Response(
        JSON.stringify({
          valid: false,
          discount: 0,
          message: "Промокод не найден или неактивен"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Проверка на дату окончания действия промокода
    if (promoData.expires_at && new Date(promoData.expires_at) <= new Date()) {
      return new Response(
        JSON.stringify({
          valid: false,
          discount: 0,
          message: "Срок действия промокода истек"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Проверка на максимальное количество использований
    if (promoData.max_uses && promoData.uses_count >= promoData.max_uses) {
      return new Response(
        JSON.stringify({
          valid: false,
          discount: 0,
          message: "Промокод использован максимальное количество раз"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Проверяем, не использовал ли пользователь этот промокод ранее, если промокод одноразовый
    if (promoData.one_time_per_user) {
      const { count, error: usageError } = await supabase
        .from("promo_code_uses")
        .select("*", { count: "exact" })
        .eq("user_id", userData.user.id)
        .eq("promo_code_id", promoData.id);

      if (!usageError && count && count > 0) {
        return new Response(
          JSON.stringify({
            valid: false,
            discount: 0,
            message: "Вы уже использовали этот промокод"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        valid: true,
        discount: promoData.discount_percent,
        message: `Промокод применен! Скидка: ${promoData.discount_percent}%`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error applying promo code:", error);
    return new Response(
      JSON.stringify({
        valid: false,
        discount: 0,
        message: "Ошибка при проверке промокода"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
