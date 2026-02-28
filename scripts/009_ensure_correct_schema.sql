-- Ensure the invoices table has the correct schema matching the database image
-- This script will add any missing columns and fix data types

-- First, let's check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_suite TEXT,
    customer_city TEXT NOT NULL,
    customer_state TEXT NOT NULL,
    customer_zip TEXT NOT NULL,
    thc_a_legal TEXT NOT NULL,
    customer_type TEXT NOT NULL,
    location_count INTEGER NOT NULL,
    sales_rep TEXT NOT NULL,
    additional_notes TEXT,
    carriers TEXT[] DEFAULT '{}',
    lift_gate TEXT NOT NULL,
    ein_file_name TEXT,
    tax_file_name TEXT,
    ein_file_url TEXT,
    tax_file_url TEXT,
    selected_products JSONB DEFAULT '{}',
    message TEXT
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Check and add order_number column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'order_number') THEN
        ALTER TABLE invoices ADD COLUMN order_number INTEGER;
        
        -- Set order numbers for existing records
        WITH numbered_rows AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
            FROM invoices
            WHERE order_number IS NULL
        )
        UPDATE invoices 
        SET order_number = numbered_rows.rn
        FROM numbered_rows 
        WHERE invoices.id = numbered_rows.id;
        
        -- Make it NOT NULL after setting values
        ALTER TABLE invoices ALTER COLUMN order_number SET NOT NULL;
    END IF;

    -- Ensure thc_a_legal is TEXT type
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'thc_a_legal' AND data_type = 'boolean') THEN
        ALTER TABLE invoices ALTER COLUMN thc_a_legal TYPE TEXT USING CASE WHEN thc_a_legal THEN 'Yes' ELSE 'No' END;
    END IF;

    -- Ensure carriers is TEXT[] (array) type
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'carriers' AND data_type = 'text') THEN
        -- Convert text to text array
        ALTER TABLE invoices ALTER COLUMN carriers TYPE TEXT[] USING string_to_array(carriers, ',');
    END IF;

    -- Add missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'customer_suite') THEN
        ALTER TABLE invoices ADD COLUMN customer_suite TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'additional_notes') THEN
        ALTER TABLE invoices ADD COLUMN additional_notes TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'lift_gate') THEN
        ALTER TABLE invoices ADD COLUMN lift_gate TEXT DEFAULT 'No';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'ein_file_name') THEN
        ALTER TABLE invoices ADD COLUMN ein_file_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_file_name') THEN
        ALTER TABLE invoices ADD COLUMN tax_file_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'ein_file_url') THEN
        ALTER TABLE invoices ADD COLUMN ein_file_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_file_url') THEN
        ALTER TABLE invoices ADD COLUMN tax_file_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'selected_products') THEN
        ALTER TABLE invoices ADD COLUMN selected_products JSONB DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'message') THEN
        ALTER TABLE invoices ADD COLUMN message TEXT;
    END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_order_number ON invoices(order_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_type ON invoices(customer_type);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure order_number is unique and auto-incrementing for new records
CREATE SEQUENCE IF NOT EXISTS invoices_order_number_seq;
ALTER TABLE invoices ALTER COLUMN order_number SET DEFAULT nextval('invoices_order_number_seq');

-- Set the sequence to start from the highest existing order number + 1
SELECT setval('invoices_order_number_seq', COALESCE((SELECT MAX(order_number) FROM invoices), 0) + 1, false);

COMMENT ON TABLE invoices IS 'Stores all customer orders and invoice information for Wazabi Labs';
COMMENT ON COLUMN invoices.order_number IS 'Sequential order number for easy reference';
COMMENT ON COLUMN invoices.thc_a_legal IS 'Whether THC-A is legal in customer state (Yes/No)';
COMMENT ON COLUMN invoices.carriers IS 'Array of preferred shipping carriers';
COMMENT ON COLUMN invoices.selected_products IS 'JSON object containing all selected products and variants';
