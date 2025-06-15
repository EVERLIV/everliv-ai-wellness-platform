
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseWebhookData, verifyCallbackToken } from "./webhook-parser.ts";
import { processPayment } from "./payment-processor.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const callbackToken = Deno.env.get('PAYKEEPER_CALLBACK_TOKEN')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Successful payment webhook received, method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    // Parse webhook data
    const webhookData = await parseWebhookData(req);

    // Verify callback token for security (if provided)
    if (!verifyCallbackToken(webhookData, req, callbackToken)) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Process the payment and create subscription
    await processPayment(supabase, webhookData);

    return new Response('OK', {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
