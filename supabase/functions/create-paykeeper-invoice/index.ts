import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceRequest {
  userId: string;
  planType: string;
  amount: number;
  description: string;
  userEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, planType, amount, description, userEmail }: InvoiceRequest = await req.json();
    
    const paykeeperToken = Deno.env.get('PAYKEEPER_TOKEN');
    if (!paykeeperToken) {
      console.error('PayKeeper token not configured');
      throw new Error('PayKeeper token not configured');
    }

    // Generate unique order ID that includes all necessary information
    const timestamp = Date.now();
    const orderId = `sub_${planType}_${userId}_${timestamp}`;
    
    console.log('Creating PayKeeper invoice for:', {
      userId,
      planType,
      amount,
      orderId,
      userEmail
    });

    // Create invoice in PayKeeper using correct API endpoint
    const invoiceData = {
      pay_amount: amount.toString(),
      clientid: userId,
      orderid: orderId,
      service_name: description,
      client_email: userEmail || '',
    };

    console.log('PayKeeper invoice data:', invoiceData);

    // Use the correct PayKeeper API endpoint for creating invoices
    const formData = new URLSearchParams();
    formData.append('token', paykeeperToken);
    Object.entries(invoiceData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    console.log('Sending request to PayKeeper API...');

    const response = await fetch('https://demo.paykeeper.ru/info/invoice/byorder/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log('PayKeeper API response status:', response.status);
    console.log('PayKeeper API response text:', responseText);

    if (!response.ok) {
      console.error('PayKeeper API error:', responseText);
      throw new Error(`PayKeeper API error: ${response.status} - ${responseText}`);
    }

    let invoiceResult;
    try {
      invoiceResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse PayKeeper response as JSON:', parseError);
      throw new Error('Invalid response from PayKeeper API');
    }

    console.log('PayKeeper invoice created:', invoiceResult);

    // Check if invoice was created successfully
    if (!invoiceResult.invoice_id && !invoiceResult.shortlink_id) {
      console.error('No invoice_id or shortlink_id in response:', invoiceResult);
      throw new Error('PayKeeper did not return a valid invoice');
    }

    // Construct payment URL
    let paymentUrl;
    if (invoiceResult.invoice_url) {
      paymentUrl = invoiceResult.invoice_url;
    } else if (invoiceResult.shortlink_id) {
      paymentUrl = `https://payment.alfabank.ru/shortlink/${invoiceResult.shortlink_id}`;
    } else {
      console.error('No payment URL available in response:', invoiceResult);
      throw new Error('No payment URL available');
    }

    // Return structured response with payment URL
    const paymentResponse = {
      success: true,
      invoice_id: invoiceResult.invoice_id,
      order_id: orderId,
      payment_url: paymentUrl,
      amount: amount,
      description: description
    };

    console.log('Returning payment response:', paymentResponse);

    return new Response(JSON.stringify(paymentResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error creating PayKeeper invoice:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
