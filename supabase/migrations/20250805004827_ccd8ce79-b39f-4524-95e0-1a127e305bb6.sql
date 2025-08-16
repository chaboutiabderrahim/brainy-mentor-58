-- Create storage bucket for previous student files
INSERT INTO storage.buckets (id, name, public) VALUES ('previous-student-files', 'previous-student-files', true);

-- Create policies for previous student files storage
CREATE POLICY "Previous students can upload their files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'previous-student-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read access to previous student files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'previous-student-files');

CREATE POLICY "Previous students can delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'previous-student-files' AND auth.uid()::text = (storage.foldername(name))[1]);