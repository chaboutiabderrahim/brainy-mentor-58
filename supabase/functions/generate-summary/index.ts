import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject_id, chapter, specific_topic } = await req.json();
    
    console.log('Generating summary for:', { subject_id, chapter, specific_topic });

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get JWT from request headers
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Get student info
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (studentError || !student) {
      throw new Error('Student not found');
    }

    // Get subject info
    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', subject_id)
      .single();

    if (subjectError || !subject) {
      throw new Error('Subject not found');
    }

    // Check if cached summary exists
    const { data: existingSummary } = await supabase
      .from('summaries')
      .select('*')
      .eq('subject_id', subject_id)
      .eq('chapter', chapter)
      .eq('is_cached', true)
      .maybeSingle();

    if (existingSummary) {
      console.log('Using cached summary');
      
      // Create a new entry for this student referencing the cached content
      const { data: userSummary, error: summaryError } = await supabase
        .from('summaries')
        .insert({
          student_id: student.id,
          subject_id: subject_id,
          chapter: chapter,
          ai_response: existingSummary.ai_response,
          is_cached: false,
        })
        .select()
        .single();

      if (summaryError) {
        console.error('Database error:', summaryError);
        throw new Error('Failed to save summary');
      }

      return new Response(JSON.stringify({ 
        success: true,
        summary_id: userSummary.id,
        content: existingSummary.ai_response,
        from_cache: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create AI prompt for new summary
    const topicInfo = specific_topic ? ` focusing specifically on "${specific_topic}"` : '';
    const prompt = `Create a comprehensive study summary for BAC students studying "${subject.name}" on the chapter "${chapter}"${topicInfo}.

Instructions:
- Write in clear, academic language appropriate for BAC level
- Include key concepts, definitions, and important formulas/theories
- Provide study tips and exam strategies
- Add memory aids and mnemonics where helpful
- Structure with clear headings and bullet points
- Focus on what's most likely to appear in BAC exams
- Keep it concise but thorough (800-1200 words)

Format the response as a well-structured study guide that students can use for revision.`;

    console.log('Calling OpenAI API for new summary...');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert BAC exam tutor who creates excellent study summaries and guides for students.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const summaryContent = data.choices[0].message.content;

    console.log('Generated summary length:', summaryContent.length);

    // Save cached summary first
    const { data: cachedSummary, error: cacheError } = await supabase
      .from('summaries')
      .insert({
        student_id: student.id, // We still need a student_id for RLS
        subject_id: subject_id,
        chapter: chapter,
        ai_response: summaryContent,
        is_cached: true,
      })
      .select()
      .single();

    if (cacheError) {
      console.error('Cache error:', cacheError);
      // Continue anyway, don't fail the request
    }

    // Save user-specific summary
    const { data: userSummary, error: summaryError } = await supabase
      .from('summaries')
      .insert({
        student_id: student.id,
        subject_id: subject_id,
        chapter: chapter,
        ai_response: summaryContent,
        is_cached: false,
      })
      .select()
      .single();

    if (summaryError) {
      console.error('Database error:', summaryError);
      throw new Error('Failed to save summary');
    }

    console.log('Summary saved successfully');

    return new Response(JSON.stringify({ 
      success: true,
      summary_id: userSummary.id,
      content: summaryContent,
      from_cache: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-summary function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});