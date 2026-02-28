-- Create the invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number SERIAL UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Customer information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_suite TEXT,
    customer_city TEXT NOT NULL,
    customer_state TEXT NOT NULL,
    customer_zip TEXT NOT NULL,
    
    -- Business information
    thca_legal BOOLEAN NOT NULL,
    customer_type TEXT NOT NULL,
    location_count INTEGER NOT NULL,
    sales_rep TEXT NOT NULL,
    additional_notes TEXT,
    
    -- Shipping preferences
    preferred_carriers TEXT[] DEFAULT '{}',
    lift_gate_required TEXT NOT NULL,
    
    -- File uploads
    ein_file_name TEXT,
    tax_file_name TEXT,
    ein_file_url TEXT,
    tax_file_url TEXT,
    
    -- Product data
    selected_products JSONB NOT NULL DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_order_number ON invoices(order_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for service role
CREATE POLICY "Allow all operations for service role" ON invoices
    FOR ALL USING (true);
