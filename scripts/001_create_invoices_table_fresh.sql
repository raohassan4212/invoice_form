-- Create the invoices table from scratch with all required columns for the new form
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number SERIAL UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Customer information (matching new form fields)
    sales_rep TEXT NOT NULL,                    -- salesRepName
    customer_name TEXT NOT NULL,                -- customerName
    customer_phone TEXT NOT NULL,               -- customerCellPhone
    business_name TEXT NOT NULL,                -- businessName
    customer_address TEXT NOT NULL,             -- address
    customer_suite TEXT,                        -- suite (optional)
    customer_city TEXT NOT NULL,                -- city
    customer_state TEXT NOT NULL,               -- state
    customer_zip TEXT NOT NULL,                 -- zip
    customer_email TEXT NOT NULL,               -- email
    pickup_or_ship TEXT NOT NULL,               -- pickupOrShip (Pick Up/Ship)
    
    -- Business/Survey information
    thc_a_legal TEXT NOT NULL,                  -- THC-A legal question (Yes/No)
    customer_status TEXT,                       -- New/Existing customer
    customer_type TEXT NOT NULL,                -- Store/Wholesale
    location_count INTEGER NOT NULL,            -- Number of locations
    
    -- File uploads
    tax_file_name TEXT,                         -- Tax permit file name
    tax_file_url TEXT,                          -- Tax permit file URL
    ein_file_name TEXT,                         -- ID file name (reusing ein column for ID)
    ein_file_url TEXT,                          -- ID file URL (reusing ein column for ID)
    
    -- Product data
    selected_products JSONB NOT NULL DEFAULT '{}',
    
    -- PDF storage
    pdf_url TEXT,                               -- Generated PDF URL
    
    -- Legacy fields (set to null/default for compatibility)
    carriers TEXT[] DEFAULT '{}',
    lift_gate TEXT DEFAULT 'No',
    additional_notes TEXT,
    message TEXT,
    
    -- Order status
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_transaction_id TEXT,
    payment_auth_code TEXT,
    payment_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_error TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_order_number ON invoices(order_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_type ON invoices(customer_type);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Create a trigger to automatically update the updated_at column
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

-- Add comments to clarify field mappings
COMMENT ON TABLE invoices IS 'Stores all customer orders and invoice information for Wazabi Labs';
COMMENT ON COLUMN invoices.sales_rep IS 'Maps to form field: salesRepName';
COMMENT ON COLUMN invoices.customer_name IS 'Maps to form field: customerName';
COMMENT ON COLUMN invoices.customer_phone IS 'Maps to form field: customerCellPhone';
COMMENT ON COLUMN invoices.business_name IS 'Maps to form field: businessName';
COMMENT ON COLUMN invoices.customer_address IS 'Maps to form field: address';
COMMENT ON COLUMN invoices.customer_suite IS 'Maps to form field: suite (optional)';
COMMENT ON COLUMN invoices.customer_city IS 'Maps to form field: city';
COMMENT ON COLUMN invoices.customer_state IS 'Maps to form field: state';
COMMENT ON COLUMN invoices.customer_zip IS 'Maps to form field: zip';
COMMENT ON COLUMN invoices.customer_email IS 'Maps to form field: email';
COMMENT ON COLUMN invoices.pickup_or_ship IS 'Maps to form field: pickupOrShip (Pick Up/Ship radio)';
COMMENT ON COLUMN invoices.tax_file_name IS 'Tax permit file name';
COMMENT ON COLUMN invoices.tax_file_url IS 'Tax permit file URL';
COMMENT ON COLUMN invoices.ein_file_name IS 'ID document file name (Driver License/ID)';
COMMENT ON COLUMN invoices.ein_file_url IS 'ID document file URL (Driver License/ID)';
