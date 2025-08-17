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
    const { subject_id, chapter, difficulty = 'medium', num_questions = 5 } = await req.json();
    
    console.log('Generating quiz for:', { subject_id, chapter, difficulty });

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

    // Create AI prompt
    const prompt = `Generate ${num_questions} BAC-style multiple choice questions for the subject "${subject.name}" on the chapter "${chapter}" with ${difficulty} difficulty level.

Instructions:
- Focus on BAC exam style questions (Moroccan Baccalaureate)
- Each question should have 4 options (A, B, C, D)
- Include detailed explanations for the correct answers
- Ensure questions test understanding, not just memorization
- Use appropriate academic language in French or Arabic when relevant

Return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "A",
      "explanation": "Detailed explanation of why this is correct"
    }
  ]
}`;

    console.log('Calling OpenAI API...');

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
            content: 'You are an expert BAC exam question generator. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content:', generatedContent);

    // Parse JSON response
    let questionsData;
    try {
      questionsData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Save quiz to database
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        student_id: student.id,
        subject_id: subject_id,
        chapter: chapter,
        difficulty: difficulty,
        questions_json: questionsData,
        total_questions: questionsData.questions.length,
      })
      .select()
      .single();

    if (quizError) {
      console.error('Database error:', quizError);
      throw new Error('Failed to save quiz');
    }

    console.log('Quiz saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      quiz_id: quiz.id,
      questions: questionsData.questions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-quiz function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});