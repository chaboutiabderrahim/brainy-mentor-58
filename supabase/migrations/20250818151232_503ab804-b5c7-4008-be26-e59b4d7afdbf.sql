-- Create subscription plans and user subscription tables

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_dzd INTEGER NOT NULL, -- Price in DZD cents (900 DZD = 90000)
  billing_interval TEXT NOT NULL DEFAULT 'monthly', -- 'monthly' or 'yearly'
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'trialing'
  allowed_subjects TEXT[] DEFAULT ARRAY[]::TEXT[],
  quiz_count_current_month INTEGER DEFAULT 0,
  quiz_limit_per_month INTEGER,
  teacher_sessions_used INTEGER DEFAULT 0,
  teacher_sessions_limit INTEGER,
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create teacher sessions tracking table
CREATE TABLE public.teacher_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id),
  subject TEXT NOT NULL,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for teacher_sessions
CREATE POLICY "Users can view their own teacher sessions" ON public.teacher_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own teacher sessions" ON public.teacher_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teacher sessions" ON public.teacher_sessions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all teacher sessions" ON public.teacher_sessions
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Insert subscription plans
INSERT INTO public.subscription_plans (plan_code, name, price_dzd, features, quiz_limit_per_month, teacher_sessions_limit) VALUES
('FREE', 'Free Plan', 0, '{
  "subjects_allowed": 0,
  "video_access": true,
  "quiz_generation": false,
  "teacher_sessions": false,
  "exam_ai_access": false,
  "description": "Access to videos only"
}', 0, 0),
('BASIC_900', 'Basic Plan', 90000, '{
  "subjects_allowed": 1,
  "video_access": true,
  "quiz_generation": true,
  "teacher_sessions": false,
  "exam_ai_access": true,
  "description": "1 subject access, 10 quizzes/month"
}', 10, 0),
('STANDARD_2700', 'Standard Plan', 270000, '{
  "subjects_allowed": 2,
  "video_access": true,
  "quiz_generation": true,
  "teacher_sessions": true,
  "exam_ai_access": true,
  "priority_booking": true,
  "description": "2 subjects, unlimited quizzes, 2 teacher sessions/month"
}', -1, 2),
('PREMIUM_5300', 'Premium Plan', 530000, '{
  "subjects_allowed": -1,
  "video_access": true,
  "quiz_generation": true,
  "teacher_sessions": true,
  "exam_ai_access": true,
  "priority_booking": true,
  "premium_diagnostics": true,
  "fast_support": true,
  "description": "All subjects, unlimited everything, 4 teacher sessions/month"
}', -1, 4);

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_sessions_updated_at
  BEFORE UPDATE ON public.teacher_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check user subscription entitlements
CREATE OR REPLACE FUNCTION public.check_subject_access(user_id UUID, subject_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN us.allowed_subjects IS NULL THEN false
    WHEN array_length(us.allowed_subjects, 1) IS NULL THEN false
    WHEN subject_name = ANY(us.allowed_subjects) THEN true
    ELSE false
  END
  FROM public.user_subscriptions us
  WHERE us.user_id = check_subject_access.user_id
    AND us.status = 'active';
$$;

-- Function to check quiz limit
CREATE OR REPLACE FUNCTION public.check_quiz_limit(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN us.quiz_limit_per_month = -1 THEN true -- unlimited
    WHEN us.quiz_count_current_month < us.quiz_limit_per_month THEN true
    ELSE false
  END
  FROM public.user_subscriptions us
  WHERE us.user_id = check_quiz_limit.user_id
    AND us.status = 'active';
$$;