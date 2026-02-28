-- Fix column names to match the API expectations
ALTER TABLE invoices 
RENAME COLUMN thca_legal TO thc_a_legal;

-- Add missing columns if they don't exist
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS carriers TEXT[];

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS lift_gate TEXT;

-- Update existing column names to match API
ALTER TABLE invoices 
RENAME COLUMN preferred_carriers TO carriers;

-- Ensure all required columns exist with correct names
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS message TEXT;

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS ein_file_url TEXT;

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS tax_file_url TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_order_number ON invoices(order_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
