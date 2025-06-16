
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { RegistrationConfirmationEmail } from "./_templates/registration-confirmation.tsx";
import { AnalysisResultsEmail } from "./_templates/analysis-results.tsx";
import { MedicalNewsletterEmail } from "./_templates/medical-newsletter.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'registration' | 'analysis' | 'newsletter';
  to: string;
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();
    
    let html: string;
    let subject: string;
    
    switch (type) {
      case 'registration':
        html = await renderAsync(
          React.createElement(RegistrationConfirmationEmail, {
            userName: data.userName,
            confirmationUrl: data.confirmationUrl,
          })
        );
        subject = "Добро пожаловать в EVERLIV! Подтвердите регистрацию";
        break;
        
      case 'analysis':
        html = await renderAsync(
          React.createElement(AnalysisResultsEmail, {
            userName: data.userName,
            analysisType: data.analysisType,
            resultsUrl: data.resultsUrl,
            keyFindings: data.keyFindings,
          })
        );
        subject = `Готовы результаты анализа: ${data.analysisType}`;
        break;
        
      case 'newsletter':
        html = await renderAsync(
          React.createElement(MedicalNewsletterEmail, {
            userName: data.userName,
            articles: data.articles,
            tips: data.tips,
          })
        );
        subject = "EVERLIV Newsletter: Новые медицинские рекомендации";
        break;
        
      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await resend.emails.send({
      from: "EVERLIV <noreply@everliv.online>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
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
