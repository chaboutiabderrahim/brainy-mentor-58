-- Fix authentication and backend issues

-- Create missing trigger for user role assignment
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create missing trigger for handle_new_student_profile  
CREATE OR REPLACE FUNCTION public.handle_new_student_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used for additional student profile setup
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Ensure alumni can be created by anyone (for self-registration)
DROP POLICY IF EXISTS "Anyone can create alumni profile" ON public.alumni;
CREATE POLICY "Anyone can create alumni profile" 
ON public.alumni 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Ensure students can be created by authenticated users
DROP POLICY IF EXISTS "Anyone can create student profile" ON public.students;
CREATE POLICY "Anyone can create student profile" 
ON public.students 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add storage policies for alumni resume uploads
CREATE POLICY "Alumni can upload their resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'alumni-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Alumni can view their resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'alumni-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add policy for admins to view all alumni resumes
CREATE POLICY "Admins can view all alumni resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'alumni-resumes' AND has_role(auth.uid(), 'admin'::user_role));