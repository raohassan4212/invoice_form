-- Fix column names to match API expectations
-- This script ensures the database schema matches exactly what the API uses

-- First, check if columns exist and rename/add as needed
DO $$
BEGIN
    -- Check if thca_legal exists and rename to thc_a_legal
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'invoices' AND column_name = 'thca_legal') THEN
        ALTER TABLE invoices RENAME COLUMN thca_legal TO thc_a_legal;
    END IF;
    
    -- Check if lift_gate_required exists and rename to lift_gate
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'invoices' AND column_name = 'lift_gate_required') THEN
        ALTER TABLE invoices RENAME COLUMN lift_gate_required TO lift_gate;
    END IF;
    
    -- Check if preferred_carriers exists and rename to carriers
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'invoices' AND column_name = 'preferred_carriers') THEN
        ALTER TABLE invoices RENAME COLUMN preferred_carriers TO carriers;
    END IF;
    
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'thc_a_legal') THEN
        ALTER TABLE invoices ADD COLUMN thc_a_legal BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'carriers') THEN
        ALTER TABLE invoices ADD COLUMN carriers TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'lift_gate') THEN
        ALTER TABLE invoices ADD COLUMN lift_gate TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'customer_suite') THEN
        ALTER TABLE invoices ADD COLUMN customer_suite TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'additional_notes') THEN
        ALTER TABLE invoices ADD COLUMN additional_notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'ein_file_url') THEN
        ALTER TABLE invoices ADD COLUMN ein_file_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'tax_file_url') THEN
        ALTER TABLE invoices ADD COLUMN tax_file_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'product_details') THEN
        ALTER TABLE invoices ADD COLUMN product_details JSONB;
    END IF;
END $$;

-- Remove NOT NULL constraints that might cause issues
ALTER TABLE invoices ALTER COLUMN lift_gate DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN carriers DROP NOT NULL;

-- Update any existing data to ensure consistency
UPDATE invoices SET 
    lift_gate = COALESCE(lift_gate, 'No'),
    carriers = COALESCE(carriers, ARRAY[]::TEXT[])
WHERE lift_gate IS NULL OR carriers IS NULL;
