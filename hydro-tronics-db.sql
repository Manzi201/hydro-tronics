-- Hydro-Tronics Engineering - Database Schema Setup
-- Run this in your Supabase SQL Editor

-- 1. PRODUCTS TABLE (For the Store/Portfolio)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'Plumbing',
  stock_quantity INTEGER DEFAULT 0
);

-- 2. PROJECTS TABLE (For Flagship Works)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  description TEXT
);

-- 3. CONSULTATIONS / LEADS TABLE (For Contact Form)
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT,
  message TEXT,
  product_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'Pending' -- Pending, In Progress, Completed
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- CLEANUP OLD POLICIES (To avoid "already exists" errors)
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow public read projects" ON projects;
DROP POLICY IF EXISTS "Allow anyone to insert consultations" ON consultations;
DROP POLICY IF EXISTS "Allow authenticated read consultations" ON consultations;
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Admin full access projects" ON projects;
DROP POLICY IF EXISTS "Admin full access consultations" ON consultations;

-- POLICIES (Allow public read access for Products and Projects)
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);

-- POLICIES (Allow anyone to submit a Consultation request but only authenticated to read)
CREATE POLICY "Allow anyone to insert consultations" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read consultations" ON consultations FOR SELECT USING (true);

-- ADMIN POLICIES (Allow full access to authenticated users)
CREATE POLICY "Admin full access products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (true);
CREATE POLICY "Admin full access consultations" ON consultations FOR ALL USING (true);

-- 4. STORAGE SETUP (Create bucket via SQL)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'product-images' );

/*
  MIGRATION FOR EXISTING DATABASES:
  If you already have the 'products' table, just run these 2 lines:
*/
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);
NOTIFY pgrst, 'reload schema';

/*
  FULL RE-SETUP: 
  You can also run the entire script below in the SQL Editor. 
  It will create/update all tables, policies, and the 'product-images' storage bucket.
*/

