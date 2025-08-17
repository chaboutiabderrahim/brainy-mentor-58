-- Create custom types
CREATE TYPE public.student_stream AS ENUM ('science', 'literature', 'math_tech', 'economics', 'languages');
CREATE TYPE public.booking_status AS ENUM ('first_offer', 'second_offer', 'third_offer', 'completed');
CREATE TYPE public.user_role AS ENUM ('student', 'admin');

-- Create students table (extends auth.users)
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stream student_stream NOT NULL,
  year_of_study INTEGER NOT NULL CHECK (year_of_study BETWEEN 1 AND 3),
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stream student_stream NOT NULL,
  chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  stream student_stream NOT NULL,
  exam_pdf_url TEXT,
  solution_pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter TEXT NOT NULL,
  title TEXT NOT NULL,
  youtube_link TEXT NOT NULL,
  uploaded_by_admin BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  questions_json JSONB NOT NULL,
  score INTEGER,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create summaries table
CREATE TABLE public.summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  is_cached BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  request_description TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  status booking_status NOT NULL DEFAULT 'first_offer',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni table
CREATE TABLE public.alumni (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stream student_stream NOT NULL,
  bac_score DECIMAL(4,2) NOT NULL CHECK (bac_score >= 0 AND bac_score <= 20),
  advice_text TEXT NOT NULL,
  resume_url TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into user_roles with default 'student' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for students
CREATE POLICY "Students can view their own profile"
  ON public.students
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile"
  ON public.students
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile"
  ON public.students
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all students"
  ON public.students
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
  ON public.subjects
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage subjects"
  ON public.subjects
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for exams (public read)
CREATE POLICY "Anyone can view exams"
  ON public.exams
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage exams"
  ON public.exams
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for videos (public read)
CREATE POLICY "Anyone can view videos"
  ON public.videos
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage videos"
  ON public.videos
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quizzes
CREATE POLICY "Students can view their own quizzes"
  ON public.quizzes
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = quizzes.student_id 
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Students can create their own quizzes"
  ON public.quizzes
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = quizzes.student_id 
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Students can update their own quizzes"
  ON public.quizzes
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = quizzes.student_id 
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all quizzes"
  ON public.quizzes
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for summaries
CREATE POLICY "Students can view their own summaries"
  ON public.summaries
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = summaries.student_id 
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Students can create summaries"
  ON public.summaries
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = summaries.student_id 
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all summaries"
  ON public.summaries
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for bookings
CREATE POLICY "Students can view their own bookings"
  ON public.bookings
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = bookings.student_id 
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Students can create their own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = bookings.student_id 
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for alumni
CREATE POLICY "Anyone can view approved alumni"
  ON public.alumni
  FOR SELECT
  USING (approved = true);

CREATE POLICY "Admins can manage alumni"
  ON public.alumni
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('bac-exams', 'bac-exams', true),
  ('summaries', 'summaries', false),
  ('quizzes', 'quizzes', false),
  ('videos', 'videos', true),
  ('alumni-resumes', 'alumni-resumes', false);

-- Storage policies for bac-exams (public read)
CREATE POLICY "Anyone can view exam files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'bac-exams');

CREATE POLICY "Admins can upload exam files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'bac-exams' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for summaries (student access)
CREATE POLICY "Students can view their summaries"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'summaries' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can upload their summaries"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'summaries' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for quizzes (student access)
CREATE POLICY "Students can view their quizzes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'quizzes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can upload their quizzes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'quizzes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for alumni resumes
CREATE POLICY "Admins can manage alumni resumes"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'alumni-resumes' AND public.has_role(auth.uid(), 'admin'));

-- Insert some sample subjects
INSERT INTO public.subjects (name, stream, chapters) VALUES
  ('Mathematics', 'science', '["Algebra", "Geometry", "Analysis", "Statistics", "Probability"]'),
  ('Physics', 'science', '["Mechanics", "Electricity", "Thermodynamics", "Optics", "Modern Physics"]'),
  ('Chemistry', 'science', '["General Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"]'),
  ('Biology', 'science', '["Cell Biology", "Genetics", "Evolution", "Ecology", "Human Biology"]'),
  ('Arabic Literature', 'literature', '["Classical Poetry", "Modern Literature", "Grammar", "Rhetoric", "Essay Writing"]'),
  ('French Literature', 'literature', '["Grammar", "Literature Analysis", "Essay Writing", "Poetry", "Theatre"]'),
  ('Philosophy', 'literature', '["Logic", "Ethics", "Metaphysics", "Political Philosophy", "Aesthetics"]'),
  ('History', 'literature', '["Ancient History", "Medieval History", "Modern History", "Contemporary History"]'),
  ('Geography', 'literature', '["Physical Geography", "Human Geography", "Economic Geography", "Regional Geography"]'),
  ('Economics', 'economics', '["Microeconomics", "Macroeconomics", "International Trade", "Development Economics"]'),
  ('Management', 'economics', '["Business Management", "Marketing", "Finance", "Human Resources"]');

-- Insert sample alumni
INSERT INTO public.alumni (name, stream, bac_score, advice_text, approved) VALUES
  ('Ahmed Benali', 'science', 18.50, 'Focus on understanding concepts rather than memorizing. Practice past exams regularly and form study groups with classmates.', true),
  ('Fatima Zahra', 'literature', 19.20, 'Read extensively beyond your textbooks. Critical thinking and essay writing skills are crucial for success in BAC Literature.', true),
  ('Mohamed Tazi', 'math_tech', 17.80, 'Mathematics requires daily practice. Start with basics and gradually move to complex problems. Never give up!', true),
  ('Aicha Alami', 'economics', 18.90, 'Connect economic theories to real-world examples. Current events and case studies will help you excel in BAC Economics.', true);