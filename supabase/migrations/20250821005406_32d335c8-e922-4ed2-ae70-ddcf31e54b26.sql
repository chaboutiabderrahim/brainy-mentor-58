-- Create demo user and fix any security issues for production deployment

-- First, ensure we have a demo user for testing
-- This user should be created through the auth system, so we'll set up a demo subscription

-- Fix function security by setting proper search paths
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert into user_roles with default 'student' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.check_subject_access(user_id uuid, subject_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.check_quiz_limit(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
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

-- Ensure proper auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure proper update triggers for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers if they don't exist
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure subjects have proper data for the app
INSERT INTO public.subjects (name, stream, chapters) VALUES 
('الرياضيات', 'science', '[
  "النهايات والاستمرارية",
  "المشتقة والتفاضل",
  "المتتاليات العددية",
  "التكامل",
  "الأعداد المركبة",
  "الهندسة في الفضاء"
]'::jsonb),
('الفيزياء', 'science', '[
  "الميكانيك",
  "الكهرباء",
  "الموجات والاهتزازات",
  "البصريات",
  "الفيزياء النووية",
  "الديناميك الحرارية"
]'::jsonb),
('الكيمياء', 'science', '[
  "البنية الذرية",
  "الروابط الكيميائية",
  "التفاعلات الكيميائية",
  "الكيمياء العضوية",
  "الأحماض والقواعد",
  "الكهروكيمياء"
]'::jsonb),
('العلوم الطبيعية', 'science', '[
  "الوراثة",
  "التنظيم العصبي",
  "التكاثر",
  "علم البيئة",
  "التمثيل الغذائي",
  "المناعة"
]'::jsonb),
('الفلسفة', 'literature', '[
  "مشكلة المعرفة",
  "مشكلة الشعور واللاشعور", 
  "الحقيقة والرأي",
  "الحرية والمسؤولية",
  "العدالة والحق",
  "الأخلاق والسياسة"
]'::jsonb),
('الأدب العربي', 'literature', '[
  "النصوص الأدبية",
  "البلاغة والنقد",
  "الشعر الجاهلي",
  "الأدب الأندلسي", 
  "الشعر الحديث",
  "القصة والمسرح"
]'::jsonb)
ON CONFLICT (name, stream) DO NOTHING;