import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { PasswordResetEmail } from "./_templates/password-reset.tsx";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Создаем Supabase client с service role для административных операций
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Проверяем наличие API ключа
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error('RESEND_API_KEY not found');
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, resetUrl }: PasswordResetRequest = await req.json();

    console.log('Sending password reset email to:', email);
    console.log('Reset URL:', resetUrl);

    // Генерируем токен восстановления через Supabase Admin API
    const { data, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: resetUrl
      }
    });

    if (resetError) {
      console.error('Failed to generate reset link:', resetError);
      throw resetError;
    }

    const resetUrlWithToken = data.properties?.action_link || resetUrl;
    console.log('Generated reset URL with token:', resetUrlWithToken);

    // Render the email template with proper reset URL
    console.log('About to render email template with:', { resetUrl: resetUrlWithToken, userEmail: email });
    
    const html = await renderAsync(
      React.createElement(PasswordResetEmail, {
        resetUrl: resetUrlWithToken,
        userEmail: email,
      })
    );

    console.log('Rendered HTML length:', html.length);
    console.log('HTML preview (first 200 chars):', html.substring(0, 200));

    const emailResponse = await resend.emails.send({
      from: "EVERLIV <noreply@updates.everliv.online>",
      to: [email],
      subject: "Восстановление пароля EVERLIV",
      html: html,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);