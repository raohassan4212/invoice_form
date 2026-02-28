-- Create storage bucket for invoices
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', true)
ON CONFLICT (id) DO NOTHING;

-- Set up CORS for the bucket
UPDATE storage.buckets 
SET cors = '[
  {
    "allowedOrigins": ["*"],
    "allowedHeaders": ["*"],
    "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]'
WHERE id = 'invoices';

-- Create storage policies
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated update" ON storage.objects
FOR UPDATE USING (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'invoices');
