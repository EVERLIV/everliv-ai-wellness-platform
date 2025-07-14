import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { searchQuery } = await req.json();
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const query = searchQuery.toLowerCase().trim();
    const results = [];

    // Поиск по медицинским анализам
    const { data: analyses } = await supabaseClient
      .from('medical_analyses')
      .select('id, analysis_type, summary, created_at')
      .eq('user_id', user.id)
      .or(`analysis_type.ilike.%${query}%,summary.ilike.%${query}%`)
      .limit(5);

    if (analyses) {
      analyses.forEach(analysis => {
        results.push({
          type: 'analysis',
          title: `Анализ: ${analysis.analysis_type}`,
          description: analysis.summary || 'Медицинский анализ',
          href: `/lab-analyses?analysisId=${analysis.id}`,
          date: analysis.created_at
        });
      });
    }

    // Поиск по биомаркерам
    const { data: biomarkers } = await supabaseClient
      .from('biomarkers')
      .select(`
        id, name, value, status, created_at,
        medical_analyses!inner(user_id)
      `)
      .eq('medical_analyses.user_id', user.id)
      .ilike('name', `%${query}%`)
      .limit(5);

    if (biomarkers) {
      biomarkers.forEach(biomarker => {
        results.push({
          type: 'biomarker',
          title: `Биомаркер: ${biomarker.name}`,
          description: `Значение: ${biomarker.value} (${biomarker.status})`,
          href: `/lab-analyses`,
          date: biomarker.created_at
        });
      });
    }

    // Поиск по рекомендациям
    const { data: recommendations } = await supabaseClient
      .from('ai_recommendations')
      .select('id, title, content, recommendation_type, created_at')
      .eq('user_id', user.id)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(5);

    if (recommendations) {
      recommendations.forEach(rec => {
        results.push({
          type: 'recommendation',
          title: `Рекомендация: ${rec.title}`,
          description: rec.content?.substring(0, 100) + '...',
          href: `/recommendations`,
          date: rec.created_at
        });
      });
    }

    // Поиск по чатам с ИИ-доктором
    const { data: chats } = await supabaseClient
      .from('ai_doctor_chats')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .ilike('title', `%${query}%`)
      .limit(5);

    if (chats) {
      chats.forEach(chat => {
        results.push({
          type: 'chat',
          title: `Чат: ${chat.title}`,
          description: 'Консультация с ИИ-доктором',
          href: `/ai-doctor?chatId=${chat.id}`,
          date: chat.created_at
        });
      });
    }

    // Поиск по протоколам здоровья
    const { data: protocols } = await supabaseClient
      .from('user_protocols')
      .select('id, title, description, created_at')
      .eq('user_id', user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);

    if (protocols) {
      protocols.forEach(protocol => {
        results.push({
          type: 'protocol',
          title: `Протокол: ${protocol.title}`,
          description: protocol.description?.substring(0, 100) + '...',
          href: `/protocols/${protocol.id}`,
          date: protocol.created_at
        });
      });
    }

    // Сортируем результаты по дате (новые сначала)
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return new Response(JSON.stringify({ 
      results: results.slice(0, 10), // Максимум 10 результатов
      query: searchQuery 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});