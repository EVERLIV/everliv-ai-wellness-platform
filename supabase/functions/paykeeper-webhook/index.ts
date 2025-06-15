
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

    console.log('Webhook received, method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    let webhookData: Record<string, string> = {};

    // Handle different content types from Alfa Bank
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // JSON payload
      const jsonData = await req.json();
      console.log('JSON webhook data:', jsonData);
      webhookData = jsonData;
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Form data
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        webhookData[key] = value.toString();
      }
      console.log('Form webhook data:', webhookData);
    } else {
      // Try to parse as text and then as form data
      const body = await req.text();
      console.log('Raw webhook body:', body);
      
      if (body.includes('=') && body.includes('&')) {
        // Parse as URL encoded
        const params = new URLSearchParams(body);
        for (const [key, value] of params.entries()) {
          webhookData[key] = value;
        }
      } else {
        try {
          webhookData = JSON.parse(body);
        } catch {
          console.error('Could not parse webhook body:', body);
          return new Response('Invalid payload format', { status: 400 });
        }
      }
    }

    console.log('Parsed webhook data:', webhookData);

    // Verify callback token for security (if provided)
    const receivedToken = webhookData.token || webhookData.callback_token || req.headers.get('x-paykeeper-token');
    if (callbackToken && receivedToken && receivedToken !== callbackToken) {
      console.error('Invalid callback token received:', receivedToken);
      return new Response('Unauthorized', { status: 401 });
    }

    // Extract payment data (adapt field names based on Alfa Bank's format)
    const {
      status,
      state,
      sum,
      amount,
      clientid,
      client_id,
      user_id,
      service_name,
      orderid,
      order_id,
      transaction_id,
      mdOrder,
      orderId
    } = webhookData;

    // Determine payment status
    const paymentStatus = status || state;
    const isSuccessful = paymentStatus === 'paid' || 
                        paymentStatus === 'success' || 
                        paymentStatus === 'DEPOSITED' ||
                        paymentStatus === '2'; // Alfa Bank success code

    if (!isSuccessful) {
      console.log('Payment not completed, status:', paymentStatus);
      return new Response('Payment not completed', { status: 200 });
    }

    // Extract amount and user ID
    const paymentAmount = parseFloat(sum || amount || '0');
    const userId = clientid || client_id || user_id;
    const orderId_final = orderid || order_id || transaction_id || mdOrder || orderId;

    console.log('Processing successful payment:', {
      userId,
      amount: paymentAmount,
      service_name,
      status: paymentStatus,
      orderId: orderId_final
    });

    // Try to determine user from stored payment info or userId
    let finalUserId: string | null = null;
    let planType = 'standard'; // Default plan

    // Strategy 1: Use userId if it looks like a UUID
    if (userId && typeof userId === 'string' && userId.length === 36 && userId.includes('-')) {
      finalUserId = userId;
    }

    // Strategy 2: Try to find user by order ID or other means
    if (!finalUserId && orderId_final) {
      // You might want to store order information in a separate table
      // For now, we'll log this case
      console.log('Could not determine user from order ID:', orderId_final);
    }

    // Strategy 3: Check for stored payment info in browser storage (this would be passed in the callback)
    if (!finalUserId) {
      console.error('Unable to identify user from webhook data. Available data:', {
        userId,
        clientid,
        client_id,
        user_id,
        orderId: orderId_final
      });
      
      // Return success to avoid retries, but log the issue
      return new Response('Payment processed but user not identified', { status: 200 });
    }

    // Determine plan type from amount or service_name
    if (service_name) {
      const serviceLower = service_name.toLowerCase();
      if (serviceLower.includes('премиум') || serviceLower.includes('premium')) {
        planType = 'premium';
      } else if (serviceLower.includes('базовый') || serviceLower.includes('basic')) {
        planType = 'basic';
      }
    } else {
      // Determine by amount (adjust these values based on your pricing)
      if (paymentAmount >= 4000) {
        planType = 'premium';
      } else if (paymentAmount >= 2000) {
        planType = 'standard';
      } else {
        planType = 'basic';
      }
    }

    console.log('Determined plan type:', planType, 'for amount:', paymentAmount);

    // Calculate expiration date (1 month from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Cancel any existing active subscription
    const { error: cancelError } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('user_id', finalUserId)
      .eq('status', 'active');

    if (cancelError) {
      console.error('Error canceling existing subscription:', cancelError);
    }

    // Create new subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: finalUserId,
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
