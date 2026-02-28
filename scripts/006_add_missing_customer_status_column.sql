-- Add the missing customer_status column to the invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_status TEXT;

-- Set a default value for existing records
UPDATE invoices SET customer_status = 'New Customer' WHERE customer_status IS NULL;

-- Add comment for the new column
COMMENT ON COLUMN invoices.customer_status IS 'Customer status: New Customer or Existing Customer';
