-- Create streams table for BAC specializations
CREATE TABLE public.streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  code TEXT NOT NULL,
  coefficient INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stream_subjects junction table
CREATE TABLE public.stream_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  coefficient INTEGER DEFAULT 1,
  is_main_subject BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(stream_id, subject_id)
);

-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  session TEXT NOT NULL, -- 'main' or 'catch_up'
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  exam_file_url TEXT,
  solution_file_url TEXT,
  ai_solution TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  duration_minutes INTEGER DEFAULT 180,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  stream_id UUID REFERENCES public.streams(id),
  graduation_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_exam_progress table
CREATE TABLE public.user_exam_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  time_spent_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exam_id)
);

-- Create daily_quizzes table
CREATE TABLE public.daily_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_quiz_attempts table
CREATE TABLE public.user_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.daily_quizzes(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Enable RLS on all tables
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exam_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to educational content
CREATE POLICY "Public read access to streams" ON public.streams FOR SELECT USING (true);
CREATE POLICY "Public read access to subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read access to stream_subjects" ON public.stream_subjects FOR SELECT USING (true);
CREATE POLICY "Public read access to exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Public read access to daily_quizzes" ON public.daily_quizzes FOR SELECT USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own exam progress" ON public.user_exam_progress FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own exam progress" ON public.user_exam_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own exam progress" ON public.user_exam_progress FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own quiz attempts" ON public.user_quiz_attempts FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own quiz attempts" ON public.user_quiz_attempts FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Insert initial streams data
INSERT INTO public.streams (name_ar, name_en, code, description) VALUES
('شعبة الرياضيات', 'Mathematics Stream', 'MATH', 'Mathematics specialization with focus on mathematics, physics, and natural sciences'),
('شعبة تقني رياضي', 'Technical Mathematics Stream', 'TECH_MATH', 'Technical mathematics with technology focus'),
('شعبة علوم تجريبية', 'Experimental Sciences Stream', 'EXP_SCI', 'Experimental sciences with natural sciences focus'),
('شعبة الآداب والفلسفة', 'Literature and Philosophy Stream', 'LIT_PHIL', 'Literature and philosophy specialization'),
('شعبة اللغات الأجنبية', 'Foreign Languages Stream', 'LANG', 'Foreign languages specialization'),
('شعبة التسيير والاقتصاد', 'Management and Economics Stream', 'MGMT_ECO', 'Management and economics specialization');

-- Insert subjects data
INSERT INTO public.subjects (name_ar, name_en, code) VALUES
('الرياضيات', 'Mathematics', 'MATH'),
('الفيزياء', 'Physics', 'PHYS'),
('العلوم الطبيعية', 'Natural Sciences', 'NAT_SCI'),
('اللغة العربية', 'Arabic Language', 'ARABIC'),
('اللغة الفرنسية', 'French Language', 'FRENCH'),
('اللغة الإنجليزية', 'English Language', 'ENGLISH'),
('الفلسفة', 'Philosophy', 'PHIL'),
('العلوم الإسلامية', 'Islamic Studies', 'ISLAMIC'),
('التاريخ والجغرافيا', 'History and Geography', 'HIST_GEO'),
('التكنولوجيا', 'Technology', 'TECH'),
('المحاسبة', 'Accounting', 'ACCOUNTING'),
('الاقتصاد والمناجمنت', 'Economics and Management', 'ECO_MGMT'),
('القانون', 'Law', 'LAW'),
('اللغة الإسبانية', 'Spanish Language', 'SPANISH'),
('اللغة الألمانية', 'German Language', 'GERMAN'),
('اللغة الإيطالية', 'Italian Language', 'ITALIAN');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_streams_updated_at BEFORE UPDATE ON public.streams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_exam_progress_updated_at BEFORE UPDATE ON public.user_exam_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();