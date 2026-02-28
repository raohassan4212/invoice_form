-- Delete any existing policies first
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;

-- Create comprehensive storage policies
CREATE POLICY "Public read access for invoices bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'invoices');

CREATE POLICY "Public upload access for invoices bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Public update access for invoices bucket" ON storage.objects
    FOR UPDATE USING (bucket_id = 'invoices');

CREATE POLICY "Public delete access for invoices bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'invoices');

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
