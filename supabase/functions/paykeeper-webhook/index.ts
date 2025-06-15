
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

    console.log('Successful payment webhook received, method:', req.method);
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

    // Extract payment data - webhook is only sent for successful payments
    const {
      sum,
      amount,
      payerEmail,
      payer_email,
      email,
      paymentDate,
      payment_date,
      date,
      service_name,
      orderid,
      order_id,
      transaction_id,
      mdOrder,
      orderId
    } = webhookData;

    // Extract required payment data
    const paymentAmount = parseFloat(sum || amount || '0');
    const userEmail = payerEmail || payer_email || email;
    const paymentDateStr = paymentDate || payment_date || date;
    const orderId_final = orderid || order_id || transaction_id || mdOrder || orderId;

    console.log('Processing successful payment:', {
      email: userEmail,
      amount: paymentAmount,
      paymentDate: paymentDateStr,
      service_name,
      orderId: orderId_final
    });

    // Validate required fields
    if (!userEmail) {
      console.error('No payer email provided in webhook data');
      return new Response('Payer email is required', { status: 400 });
    }

    // Find user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return new Response('Error fetching user data', { status: 500 });
    }

    const user = userData.users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error('User not found with email:', userEmail);
      return new Response('User not found', { status: 404 });
    }

    const userId = user.id;
    console.log('Found user ID:', userId, 'for email:', userEmail);

    // Determine plan type from amount or service_name
    let planType = 'premium'; // Default to premium for paid subscriptions
    
    if (service_name) {
      const serviceLower = service_name.toLowerCase();
      if (serviceLower.includes('базовый') || serviceLower.includes('basic')) {
        planType = 'basic';
      } else if (serviceLower.includes('стандарт') || serviceLower.includes('standard')) {
        planType = 'standard';
      } else if (serviceLower.includes('премиум') || serviceLower.includes('premium')) {
        planType = 'premium';
      }
    } else {
      // Determine by amount (adjust these values based on your pricing)
      if (paymentAmount >= 4000) {
        planType = 'premium';
      } else if (paymentAmount >= 2000) {
        planType = 'standard';
      } else if (paymentAmount >= 1000) {
        planType = 'basic';
      }
    }

    console.log('Determined plan type:', planType, 'for amount:', paymentAmount);

    // Calculate expiration date (30 days from payment date)
    let expiresAt: Date;
    
    if (paymentDateStr) {
      // Parse payment date and add 30 days
      const paymentDateParsed = new Date(paymentDateStr);
      if (!isNaN(paymentDateParsed.getTime())) {
        expiresAt = new Date(paymentDateParsed);
        expiresAt.setDate(expiresAt.getDate() + 30);
      } else {
        console.warn('Invalid payment date format:', paymentDateStr, 'using current date');
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
      }
    } else {
      // If no payment date provided, use current date + 30 days
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
    }

    console.log('Subscription will expire at:', expiresAt.toISOString());

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
        started_at: paymentDateStr ? new Date(paymentDateStr).toISOString() : new Date().toISOString(),
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
