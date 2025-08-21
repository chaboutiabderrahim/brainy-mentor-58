-- Fix security issues for production deployment

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

-- Ensure proper update function
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