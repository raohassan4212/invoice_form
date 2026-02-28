-- Add customer_email column to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_email text;
