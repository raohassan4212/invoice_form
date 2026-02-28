-- Create storage bucket for invoices and documents
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
