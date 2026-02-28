-- Add missing columns to the invoices table if they don't exist
DO $$ 
BEGIN
    -- Add ein_file_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'ein_file_url') THEN
        ALTER TABLE invoices ADD COLUMN ein_file_url TEXT;
    END IF;
    
    -- Add tax_file_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'tax_file_url') THEN
        ALTER TABLE invoices ADD COLUMN tax_file_url TEXT;
    END IF;
END $$;
