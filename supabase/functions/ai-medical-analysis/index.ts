
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { analysisData, inputMethod = 'text' } = await req.json()

    // Input validation and sanitization
    if (!analysisData || typeof analysisData !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid analysis data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize input - remove potential harmful content
    const sanitizedInput = analysisData
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim()
      .substring(0, 10000) // Limit input length

    if (sanitizedInput.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or empty input after sanitization' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call OpenAI API with secure configuration
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a medical AI assistant. Analyze the provided medical data and provide insights. 
            IMPORTANT: Do not provide specific medical diagnoses or treatment recommendations. 
            Always recommend consulting with healthcare professionals for medical decisions.`
          },
          {
            role: 'user',
            content: `Please analyze this medical data: ${sanitizedInput}`
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiResponse.status)
      return new Response(
        JSON.stringify({ error: 'Analysis service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiData = await openaiResponse.json()
    const analysisResult = openaiData.choices[0]?.message?.content

    if (!analysisResult) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store analysis result securely in database
    const { data: analysisRecord, error: dbError } = await supabaseClient
      .from('medical_analyses')
      .insert({
        user_id: user.id,
        analysis_type: 'general',
        input_method: inputMethod,
        results: { analysis: analysisResult },
        summary: analysisResult.substring(0, 500) + '...',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error (sanitized):', dbError.code)
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        analysis: analysisResult,
        analysisId: analysisRecord.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    // Sanitized error logging - no sensitive data
    console.error('Analysis function error:', error.name)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
