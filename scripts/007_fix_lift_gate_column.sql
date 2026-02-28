-- Fix the lift_gate column name mismatch
-- The database has 'lift_gate_required' but the API is using 'lift_gate'

-- First, check if lift_gate_required exists and lift_gate doesn't
DO $$ 
BEGIN
    -- If lift_gate_required exists and lift_gate doesn't, rename it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'lift_gate_required') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'lift_gate') THEN
        ALTER TABLE invoices RENAME COLUMN lift_gate_required TO lift_gate;
    END IF;
    
    -- If both exist, drop lift_gate and rename lift_gate_required
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'lift_gate_required') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'lift_gate') THEN
        ALTER TABLE invoices DROP COLUMN IF EXISTS lift_gate;
        ALTER TABLE invoices RENAME COLUMN lift_gate_required TO lift_gate;
    END IF;
    
    -- If neither exists, create lift_gate
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'lift_gate_required') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'lift_gate') THEN
        ALTER TABLE invoices ADD COLUMN lift_gate TEXT;
    END IF;
END $$;

-- Ensure the column allows NULL values or has a default
ALTER TABLE invoices ALTER COLUMN lift_gate DROP NOT NULL;
