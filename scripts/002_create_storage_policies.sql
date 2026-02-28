-- Create storage policies for the invoices bucket
CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'invoices');
