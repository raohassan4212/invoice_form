-- Add pdf_url column to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_url TEXT;
