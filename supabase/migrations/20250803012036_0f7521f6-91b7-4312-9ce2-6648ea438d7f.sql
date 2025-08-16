-- Add role to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'regular_student' CHECK (role IN ('regular_student', 'previous_student', 'admin'));

-- Create subjects_chapters table for video organization
CREATE TABLE public.subjects_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table for storing video content
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.subjects_chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  video_file_url TEXT,
  is_recommended BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create previous_student_pdfs table for PDF uploads
CREATE TABLE public.previous_student_pdfs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teaching_schedules table for previous student schedules
CREATE TABLE public.teaching_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.subjects_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previous_student_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for subjects_chapters
CREATE POLICY "Public read access to subjects_chapters" 
ON public.subjects_chapters 
FOR SELECT 
USING (true);

-- Create policies for videos
CREATE POLICY "Public read access to videos" 
ON public.videos 
FOR SELECT 
USING (true);

-- Create policies for previous_student_pdfs
CREATE POLICY "Public read access to previous_student_pdfs" 
ON public.previous_student_pdfs 
FOR SELECT 
USING (true);

CREATE POLICY "Previous students can manage their own PDFs" 
ON public.previous_student_pdfs 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policies for teaching_schedules
CREATE POLICY "Students can view their own teaching schedule" 
ON public.teaching_schedules 
FOR SELECT 
USING (auth.uid() = student_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_subjects_chapters_updated_at
  BEFORE UPDATE ON public.subjects_chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_previous_student_pdfs_updated_at
  BEFORE UPDATE ON public.previous_student_pdfs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teaching_schedules_updated_at
  BEFORE UPDATE ON public.teaching_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for Math chapters
INSERT INTO public.subjects_chapters (subject_id, name_ar, name_en) 
SELECT id, 'النهايات', 'Limits' FROM public.subjects WHERE code = 'MATH'
UNION ALL
SELECT id, 'المشتقات', 'Derivatives' FROM public.subjects WHERE code = 'MATH'
UNION ALL
SELECT id, 'التكامل', 'Integration' FROM public.subjects WHERE code = 'MATH'
UNION ALL
SELECT id, 'الهندسة في الفضاء', 'Geometry in Space' FROM public.subjects WHERE code = 'MATH';

-- Insert sample data for Physics chapters  
INSERT INTO public.subjects_chapters (subject_id, name_ar, name_en)
SELECT id, 'الميكانيك', 'Mechanics' FROM public.subjects WHERE code = 'PHYS'
UNION ALL
SELECT id, 'الكهرباء', 'Electricity' FROM public.subjects WHERE code = 'PHYS'
UNION ALL
SELECT id, 'المغناطيسية', 'Magnetism' FROM public.subjects WHERE code = 'PHYS'
UNION ALL
SELECT id, 'البصريات', 'Optics' FROM public.subjects WHERE code = 'PHYS';

-- Insert sample recommended videos
INSERT INTO public.videos (chapter_id, title, description, youtube_url, is_recommended)
SELECT sc.id, 'شرح النهايات - الجزء الأول', 'شرح مفصل لمفهوم النهايات في الرياضيات', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true
FROM public.subjects_chapters sc 
JOIN public.subjects s ON sc.subject_id = s.id 
WHERE s.code = 'MATH' AND sc.name_ar = 'النهايات'
UNION ALL
SELECT sc.id, 'أساسيات الميكانيك', 'مقدمة في علم الميكانيك للباكالوريا', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true
FROM public.subjects_chapters sc 
JOIN public.subjects s ON sc.subject_id = s.id 
WHERE s.code = 'PHYS' AND sc.name_ar = 'الميكانيك';

-- Create example users with different roles
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'student@example.com', '$2a$10$example', now(), now(), now(), '{"display_name": "Ahmed Ali"}'),
  ('22222222-2222-2222-2222-222222222222', 'graduate@example.com', '$2a$10$example', now(), now(), now(), '{"display_name": "Sara Mohamed"}')
ON CONFLICT (id) DO NOTHING;

-- Create profiles for example users
INSERT INTO public.profiles (user_id, display_name, role, stream_id)
SELECT '11111111-1111-1111-1111-111111111111', 'Ahmed Ali', 'regular_student', s.id
FROM public.streams s WHERE s.code = 'SM'
UNION ALL
SELECT '22222222-2222-2222-2222-222222222222', 'Sara Mohamed', 'previous_student', s.id
FROM public.streams s WHERE s.code = 'SM'
ON CONFLICT (user_id) DO NOTHING;