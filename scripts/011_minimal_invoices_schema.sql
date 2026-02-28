-- Creating minimal invoices table with only required fields for current form
-- Clean schema with just the essential fields used by the current form

-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS invoices CASCADE;
DROP SEQUENCE IF EXISTS invoices_order_number_seq CASCADE;

-- Create the minimal invoices table
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Detail screen fields (from new details screen)
    account_manager TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    customer_cell_phone TEXT NOT NULL,
    
    -- Form fields
    customer_type TEXT NOT NULL,
    is_7oh_legal TEXT NOT NULL,
    customer_status TEXT NOT NULL,
    
    -- Product data
    selected_products JSONB DEFAULT '{}',
    
    -- Optional file uploads (no longer required)
    tax_permit_file_url TEXT,
    id_file_url TEXT
);

-- Create sequence for auto-incrementing order numbers
CREATE SEQUENCE invoices_order_number_seq START 1;
ALTER TABLE invoices ALTER COLUMN order_number SET DEFAULT nextval('invoices_order_number_seq');

-- Create indexes for performance
CREATE INDEX idx_invoices_order_number ON invoices(order_number);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_invoices_customer_type ON invoices(customer_type);

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for data protection
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a contact form, no auth required)
CREATE POLICY "Allow public insert" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON invoices FOR SELECT USING (true);

COMMENT ON TABLE invoices IS 'Minimal invoices table for contact form orders';
COMMENT ON COLUMN invoices.is_7oh_legal IS 'Whether 7-Hydroxymitragynine (7-OH) is legal in customer state';
COMMENT ON COLUMN invoices.selected_products IS 'JSON object containing selected products and quantities';
