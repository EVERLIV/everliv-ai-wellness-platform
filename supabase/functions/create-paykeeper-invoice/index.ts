
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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, planType, amount, description }: InvoiceRequest = await req.json();
    
    const paykeeperToken = Deno.env.get('PAYKEEPER_TOKEN');
    if (!paykeeperToken) {
      throw new Error('PayKeeper token not configured');
    }

    // Create invoice in PayKeeper using correct API endpoint
    const invoiceData = {
      pay_amount: amount,
      clientid: userId,
      orderid: `sub_${planType}_${userId}_${Date.now()}`,
      service_name: description,
      client_email: '', // Will be filled from user profile if needed
    };

    console.log('Creating PayKeeper invoice:', invoiceData);

    // Use the correct PayKeeper API endpoint for creating invoices
    const response = await fetch('https://demo.paykeeper.ru/info/invoice/byorder/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: paykeeperToken,
        ...Object.fromEntries(
          Object.entries(invoiceData).map(([key, value]) => [key, String(value)])
        ),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayKeeper API error:', errorText);
      throw new Error(`PayKeeper API error: ${response.status}`);
    }

    const invoiceResult = await response.json();
    console.log('PayKeeper invoice created:', invoiceResult);

    // Return structured response with payment URL
    const paymentResponse = {
      success: true,
      invoice_id: invoiceResult.invoice_id,
      order_id: invoiceData.orderid,
      payment_url: invoiceResult.invoice_url || `https://payment.alfabank.ru/shortlink/${invoiceResult.shortlink_id}`,
      amount: amount,
      description: description
    };

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
