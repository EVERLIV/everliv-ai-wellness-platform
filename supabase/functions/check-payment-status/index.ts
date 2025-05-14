
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
    const { paymentId } = await req.json();

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

    // Получаем информацию о платеже из базы данных
    const { data: paymentData, error: paymentError } = await supabase
      .from("payment_sessions")
      .select("status, user_id")
      .eq("id", paymentId)
      .single();

    if (paymentError) {
      return new Response(
        JSON.stringify({ error: "Платеж не найден" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Проверяем, что платеж принадлежит текущему пользователю
    if (paymentData.user_id !== userData.user.id) {
      return new Response(
        JSON.stringify({ error: "Доступ запрещен" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ status: paymentData.status }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking payment status:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при проверке статуса платежа" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
