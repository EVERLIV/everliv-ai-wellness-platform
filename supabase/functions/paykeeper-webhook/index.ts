
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseWebhookData, verifyCallbackToken, verifyDigitalSignature } from "./webhook-parser.ts";
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
    const publicKey = Deno.env.get('PAYKEEPER_PUBLIC_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('PayKeeper webhook received, method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    // Parse webhook data
    const webhookData = await parseWebhookData(req);

    // Verify callback token for basic security
    if (!verifyCallbackToken(webhookData, req, callbackToken)) {
      console.error('Callback token verification failed');
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('Callback token verification passed');

    // Verify digital signature if public key is configured
    if (publicKey) {
      console.log('Public key configured, verifying digital signature...');
      const signatureValid = await verifyDigitalSignature(webhookData, publicKey);
      
      if (!signatureValid) {
        console.error('Digital signature verification failed');
        return new Response('Invalid signature', { status: 401 });
      }
      
      console.log('Digital signature verification passed');
    } else {
      console.log('No public key configured, skipping digital signature verification');
    }

    // Process the payment and create subscription
    console.log('Processing payment...');
    await processPayment(supabase, webhookData);

    console.log('Payment processed successfully');
    return new Response('OK', {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error: any) {
    console.error('Error processing PayKeeper webhook:', error);
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
