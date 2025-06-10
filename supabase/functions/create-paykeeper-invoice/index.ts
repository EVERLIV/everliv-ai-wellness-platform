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

    // Create invoice in PayKeeper
    const invoiceData = {
      pay_amount: amount,
      clientid: userId,
      orderid: `sub_${planType}_${userId}_${Date.now()}`,
      service_name: description,
      client_email: '', // Will be filled from user profile if needed
    };

    console.log('Creating PayKeeper invoice:', invoiceData);

    const response = await fetch('https://paykeeper.alfabank.ru/info/invoice/byid/', {
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

    return new Response(JSON.stringify(invoiceResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error creating PayKeeper invoice:', error);
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
