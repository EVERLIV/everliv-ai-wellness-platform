
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
    // Authentication check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { message, chatId } = await req.json()

    // Input validation and sanitization
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const sanitizedMessage = message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim()
      .substring(0, 2000) // Limit message length

    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting check (basic implementation)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabaseClient
      .from('ai_doctor_messages')
      .select('id', { count: 'exact', head: true })
      .eq('chat_id', chatId)
      .gte('created_at', oneHourAgo)

    if (count && count > 50) { // Limit to 50 messages per hour per chat
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait before sending more messages.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify chat ownership
    const { data: chatData, error: chatError } = await supabaseClient
      .from('ai_doctor_chats')
      .select('user_id')
      .eq('id', chatId)
      .single()

    if (chatError || chatData.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Chat not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get recent chat history for context (limited for security)
    const { data: recentMessages } = await supabaseClient
      .from('ai_doctor_messages')
      .select('role, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(10)

    const messages = [
      {
        role: 'system',
        content: `You are a helpful medical AI assistant. Provide general health information and guidance. 
        IMPORTANT DISCLAIMERS:
        - Do not provide specific medical diagnoses
        - Do not recommend specific medications or treatments
        - Always advise consulting healthcare professionals for medical decisions
        - Keep responses informative but general
        - Do not store or remember personal medical information between conversations`
      },
      ...(recentMessages?.reverse() || []),
      { role: 'user', content: sanitizedMessage }
    ]

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiResponse.status)
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiData = await openaiResponse.json()
    const aiResponse = openaiData.choices[0]?.message?.content

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store both user message and AI response
    const { error: userMsgError } = await supabaseClient
      .from('ai_doctor_messages')
      .insert({
        chat_id: chatId,
        role: 'user',
        content: sanitizedMessage,
      })

    const { error: aiMsgError } = await supabaseClient
      .from('ai_doctor_messages')
      .insert({
        chat_id: chatId,
        role: 'assistant',
        content: aiResponse,
      })

    if (userMsgError || aiMsgError) {
      console.error('Database error (sanitized):', userMsgError?.code || aiMsgError?.code)
      return new Response(
        JSON.stringify({ error: 'Failed to save conversation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    // Sanitized error logging
    console.error('Chat function error:', error.name)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
