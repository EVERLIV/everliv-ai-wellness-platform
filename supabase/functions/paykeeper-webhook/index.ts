
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Parse webhook data from PayKeeper
    const formData = await req.formData();
    const webhookData: Record<string, string> = {};
    
    for (const [key, value] of formData.entries()) {
      webhookData[key] = value.toString();
    }

    console.log('PayKeeper webhook received:', webhookData);

    // Verify callback token for security
    const receivedToken = webhookData.token || req.headers.get('x-paykeeper-token');
    if (receivedToken !== callbackToken) {
      console.error('Invalid callback token received:', receivedToken);
      return new Response('Unauthorized', { status: 401 });
    }

    const { status, sum, clientid, service_name, orderid } = webhookData;

    // Verify that payment was successful
    if (status !== 'paid') {
      console.log('Payment not completed, status:', status);
      return new Response('Payment not completed', { status: 200 });
    }

    console.log('Processing successful payment:', {
      clientid,
      sum,
      service_name,
      status,
      orderid
    });

    // Try to determine user from stored payment info or clientid
    let userId: string | null = null;
    let planType = 'standard'; // Default plan

    // Since we're using a static payment page, we need to identify the user
    // This is challenging with static pages, but we can implement a few strategies:

    // Strategy 1: Use clientid if it looks like a UUID
    if (clientid && clientid.length === 36 && clientid.includes('-')) {
      userId = clientid;
    }

    // Strategy 2: If no valid userId found, we might need additional logic
    // For now, let's log this case and return an error
    if (!userId) {
      console.error('Unable to identify user from webhook data. ClientID:', clientid);
      
      // For static payment pages, you might need to:
      // 1. Add custom fields to capture user info
      // 2. Use a different identification strategy
      // 3. Have users input their email/ID on the payment page
      
      return new Response('Unable to identify user', { status: 400 });
    }

    // Determine plan type from amount or service_name
    const amount = parseFloat(sum);
    if (service_name) {
      if (service_name.toLowerCase().includes('премиум') || service_name.toLowerCase().includes('premium')) {
        planType = 'premium';
      } else if (service_name.toLowerCase().includes('базовый') || service_name.toLowerCase().includes('basic')) {
        planType = 'basic';
      }
    } else {
      // Determine by amount
      if (amount >= 4000) {
        planType = 'premium';
      } else if (amount >= 2000) {
        planType = 'standard';
      } else {
        planType = 'basic';
      }
    }

    console.log('Determined plan type:', planType, 'for amount:', amount);

    // Calculate expiration date (1 month from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Cancel any existing active subscription
    const { error: cancelError } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (cancelError) {
      console.error('Error canceling existing subscription:', cancelError);
    }

    // Create new subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw subscriptionError;
    }

    console.log('Subscription created successfully:', subscription);

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
