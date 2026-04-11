-- =========================================
-- Complete Supabase Setup for GlobalVisa
-- =========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- 1. APPLICATIONS TABLE
-- =========================================
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- =========================================
-- 2. CONSULTATIONS TABLE
-- =========================================
CREATE TABLE consultations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  message TEXT,
  service_type TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultations (public insert, admin view)
CREATE POLICY "Anyone can submit consultations" ON consultations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view consultations" ON consultations
  FOR SELECT USING (auth.role() = 'authenticated');

-- =========================================
-- 3. VISA PROGRAMS TABLE
-- =========================================
CREATE TABLE visa_programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  processing_time TEXT,
  fees JSONB,
  eligibility_criteria JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE visa_programs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visa_programs (public read)
CREATE POLICY "Anyone can view visa programs" ON visa_programs
  FOR SELECT USING (true);

-- =========================================
-- 4. BLOG POSTS TABLE
-- =========================================
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  tags TEXT[],
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts (public read published posts)
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- =========================================
-- 5. USER PROFILES TABLE (extends auth.users)
-- =========================================
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  current_country TEXT,
  address JSONB,
  emergency_contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- =========================================
-- 6. STORAGE BUCKET SETUP
-- =========================================
-- Create the user-documents bucket (do this in Supabase Dashboard > Storage)
-- Bucket Name: user-documents
-- Public: false (private)

-- Storage policies for user-documents bucket
-- Allow users to upload to their own folder
CREATE POLICY "Users can upload to their own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own files
CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own files
CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =========================================
-- 7. FUNCTIONS AND TRIGGERS
-- =========================================

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER handle_updated_at_applications
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_consultations
  BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_visa_programs
  BEFORE UPDATE ON visa_programs
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_blog_posts
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- =========================================
-- 8. SAMPLE DATA INSERTION
-- =========================================

-- Insert sample visa programs
INSERT INTO visa_programs (country, visa_type, name, description, requirements, processing_time, fees) VALUES
('Canada', 'Work', 'Express Entry', 'Points-tested system for skilled workers', ARRAY['Valid passport', 'Educational Credential Assessment', 'Language test results', 'Proof of funds'], '6-8 months', '{"application": 155, "biometrics": 85}'::jsonb),
('Australia', 'Work', 'Skilled Work Visa', 'Points-tested skilled migration program', ARRAY['Skills assessment', 'English proficiency', 'Health check', 'Character certificate'], '3-6 months', '{"base": 4080, "additional": 2070}'::jsonb),
('Germany', 'Work', 'EU Blue Card', 'Highly qualified non-EU workers', ARRAY['University degree', 'Work contract', 'Health insurance', 'Accommodation proof'], '1-3 months', '{"application": 75}'::jsonb);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, author, tags, is_published, published_at) VALUES
('Complete Guide to Canadian Express Entry', 'canadian-express-entry-guide',
 'Express Entry is Canada''s points-based system for skilled workers...',
 'Learn everything about Canada''s Express Entry system',
 'GlobalVisa Team',
 ARRAY['Canada', 'Express Entry', 'Immigration'],
 true,
 NOW() - INTERVAL '7 days'
);

-- =========================================
-- 9. AUTHENTICATION CONFIGURATION
-- =========================================
-- Configure authentication settings in Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Configure site URL: https://yourdomain.com (or http://localhost:5173 for development)
-- 3. Configure redirect URLs for password reset, email confirmations, etc.
-- 4. Enable email confirmations if desired
-- 5. Configure SMTP settings for custom email templates

-- =========================================
-- 10. EDGE FUNCTIONS (Optional)
-- =========================================
-- For advanced features, you can create Edge Functions for:
-- - Email notifications
-- - Document processing
-- - Payment integration
-- - Background job processing

-- Example: Create a function to send email notifications
-- (Create this in Supabase Dashboard > Edge Functions)

-- =========================================
-- SETUP COMPLETE
-- =========================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Create the 'user-documents' storage bucket
-- 3. Configure authentication settings
-- 4. Test the connection from your React app
-- 5. Update your React components to use real data instead of mock data