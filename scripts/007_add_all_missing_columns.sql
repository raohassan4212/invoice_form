-- Add all missing columns to the invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_status TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_auth_code TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_error TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Set default values for existing records
UPDATE invoices SET 
    customer_status = COALESCE(customer_status, 'New Customer'),
    status = COALESCE(status, 'pending'),
    payment_status = COALESCE(payment_status, 'pending'),
    payment_amount = COALESCE(payment_amount, 0.00)
WHERE customer_status IS NULL OR status IS NULL OR payment_status IS NULL OR payment_amount IS NULL;

-- Add comments for the new columns
COMMENT ON COLUMN invoices.customer_status IS 'Customer status: New Customer or Existing Customer';
COMMENT ON COLUMN invoices.status IS 'Order status: pending, completed, cancelled';
COMMENT ON COLUMN invoices.payment_status IS 'Payment status: pending, paid, failed';
COMMENT ON COLUMN invoices.pdf_url IS 'URL to generated PDF invoice';
