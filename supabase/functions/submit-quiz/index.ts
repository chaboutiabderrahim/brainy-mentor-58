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
    const { quiz_id, answers } = await req.json();
    
    console.log('Submitting quiz:', { quiz_id, answers });

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

    // Get quiz info
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quiz_id)
      .eq('student_id', student.id) // Ensure student owns this quiz
      .single();

    if (quizError || !quiz) {
      throw new Error('Quiz not found or access denied');
    }

    if (quiz.completed_at) {
      throw new Error('Quiz already completed');
    }

    // Calculate score
    const questions = quiz.questions_json.questions;
    let correctAnswers = 0;
    const results = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      results.push({
        question_index: i,
        question: question.question,
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        explanation: question.explanation
      });
    }

    const score = Math.round((correctAnswers / questions.length) * 100);

    console.log(`Quiz scored: ${correctAnswers}/${questions.length} (${score}%)`);

    // Update quiz with score and completion time
    const { data: updatedQuiz, error: updateError } = await supabase
      .from('quizzes')
      .update({
        score: score,
        completed_at: new Date().toISOString(),
      })
      .eq('id', quiz_id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to update quiz');
    }

    console.log('Quiz completed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      score: score,
      correct_answers: correctAnswers,
      total_questions: questions.length,
      percentage: score,
      results: results,
      quiz: updatedQuiz
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in submit-quiz function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});