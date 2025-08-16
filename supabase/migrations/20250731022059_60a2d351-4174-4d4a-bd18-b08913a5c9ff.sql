-- Create storage buckets for exam files
INSERT INTO storage.buckets (id, name, public) VALUES 
('exam-files', 'exam-files', true),
('solution-files', 'solution-files', true);

-- Create storage policies for exam files
CREATE POLICY "Public read access to exam files"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'exam-files');

CREATE POLICY "Admin upload exam files"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'exam-files');

CREATE POLICY "Public read access to solution files"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'solution-files');

CREATE POLICY "Admin upload solution files"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'solution-files');

-- Insert sample exam data for Mathematics Stream 2025
-- Get the stream and subject IDs first
DO $$
DECLARE
    math_stream_id UUID;
    math_subject_id UUID;
    physics_subject_id UUID;
    nat_sci_subject_id UUID;
BEGIN
    -- Get Mathematics stream ID
    SELECT id INTO math_stream_id FROM public.streams WHERE code = 'MATH';
    
    -- Get subject IDs
    SELECT id INTO math_subject_id FROM public.subjects WHERE code = 'MATH';
    SELECT id INTO physics_subject_id FROM public.subjects WHERE code = 'PHYS';
    SELECT id INTO nat_sci_subject_id FROM public.subjects WHERE code = 'NAT_SCI';
    
    -- Insert Mathematics exams for 2025
    INSERT INTO public.exams (title, year, session, stream_id, subject_id, difficulty_level, duration_minutes) VALUES
    ('امتحان الرياضيات - الدورة الرئيسية 2025', 2025, 'main', math_stream_id, math_subject_id, 4, 240),
    ('امتحان الرياضيات - دورة الاستدراك 2025', 2025, 'catch_up', math_stream_id, math_subject_id, 3, 240),
    ('امتحان الفيزياء - الدورة الرئيسية 2025', 2025, 'main', math_stream_id, physics_subject_id, 4, 180),
    ('امتحان الفيزياء - دورة الاستدراك 2025', 2025, 'catch_up', math_stream_id, physics_subject_id, 3, 180),
    ('امتحان العلوم الطبيعية - الدورة الرئيسية 2025', 2025, 'main', math_stream_id, nat_sci_subject_id, 3, 180),
    ('امتحان العلوم الطبيعية - دورة الاستدراك 2025', 2025, 'catch_up', math_stream_id, nat_sci_subject_id, 3, 180);
    
    -- Insert more years (2024, 2023, 2022, etc.)
    INSERT INTO public.exams (title, year, session, stream_id, subject_id, difficulty_level, duration_minutes) VALUES
    ('امتحان الرياضيات - الدورة الرئيسية 2024', 2024, 'main', math_stream_id, math_subject_id, 4, 240),
    ('امتحان الرياضيات - دورة الاستدراك 2024', 2024, 'catch_up', math_stream_id, math_subject_id, 3, 240),
    ('امتحان الفيزياء - الدورة الرئيسية 2024', 2024, 'main', math_stream_id, physics_subject_id, 4, 180),
    ('امتحان الفيزياء - دورة الاستدراك 2024', 2024, 'catch_up', math_stream_id, physics_subject_id, 3, 180),
    ('امتحان الرياضيات - الدورة الرئيسية 2023', 2023, 'main', math_stream_id, math_subject_id, 4, 240),
    ('امتحان الفيزياء - الدورة الرئيسية 2023', 2023, 'main', math_stream_id, physics_subject_id, 4, 180);
END $$;