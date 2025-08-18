-- Fix security warnings and create demo user

-- Fix function search paths (security fix)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_roles with default 'student' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.handle_new_student_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used for additional student profile setup
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create demo user data (insert into auth.users happens at application level)
-- Insert demo student profile
INSERT INTO public.students (id, user_id, name, stream, year_of_study, whatsapp)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- placeholder, will be updated when demo user is created
  'Ahmed Demo User',
  'science_math',
  3,
  '+212 6XX XXX XXX'
) ON CONFLICT DO NOTHING;

-- Insert demo user role
INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'student')
ON CONFLICT DO NOTHING;