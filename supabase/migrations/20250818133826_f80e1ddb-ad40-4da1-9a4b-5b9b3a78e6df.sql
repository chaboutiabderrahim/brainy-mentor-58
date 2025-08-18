-- Create demo user data with correct enum values

-- Insert demo student profile with correct enum value
INSERT INTO public.students (id, user_id, name, stream, year_of_study, whatsapp)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- placeholder, will be updated when demo user is created
  'Ahmed Demo User',
  'science', -- correct enum value
  3,
  '+212 6XX XXX XXX'
) ON CONFLICT DO NOTHING;

-- Insert demo user role
INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'student')
ON CONFLICT DO NOTHING;