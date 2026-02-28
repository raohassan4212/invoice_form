-- Simple storage policies for the invoices bucket
CREATE POLICY "Anyone can view files in invoices bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'invoices');

CREATE POLICY "Anyone can upload files to invoices bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Anyone can update files in invoices bucket" ON storage.objects
    FOR UPDATE USING (bucket_id = 'invoices');

CREATE POLICY "Anyone can delete files in invoices bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'invoices');
