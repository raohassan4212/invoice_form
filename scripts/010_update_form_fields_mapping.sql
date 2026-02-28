-- Update the invoices table to match the new simplified form structure
-- This script will add new columns and update the API mapping

-- Add new columns that match the form field names
DO $$ 
BEGIN
    -- Add business_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'business_name') THEN
        ALTER TABLE invoices ADD COLUMN business_name TEXT;
    END IF;
    
    -- Add pickup_or_ship column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'pickup_or_ship') THEN
        ALTER TABLE invoices ADD COLUMN pickup_or_ship TEXT;
    END IF;
    
    -- Ensure all existing columns are properly named and typed
    -- The API will map form fields to these database columns:
    -- salesRepName -> sales_rep
    -- customerName -> customer_name  
    -- customerCellPhone -> customer_phone
    -- businessName -> business_name
    -- address -> customer_address
    -- suite -> customer_suite
    -- city -> customer_city
    -- state -> customer_state
    -- zip -> customer_zip
    -- email -> customer_email
    -- pickupOrShip -> pickup_or_ship
    -- taxPermitFile -> tax_file_name, tax_file_url
    -- idFile -> ein_file_name, ein_file_url
    
END $$;

-- Update any existing records to have default values for new fields
UPDATE invoices 
SET 
    business_name = COALESCE(business_name, 'Not Provided'),
    pickup_or_ship = COALESCE(pickup_or_ship, 'Not Specified')
WHERE business_name IS NULL OR pickup_or_ship IS NULL;

-- Add comments to clarify the field mappings
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
COMMENT ON COLUMN invoices.tax_file_name IS 'Maps to form field: taxPermitFile filename';
COMMENT ON COLUMN invoices.tax_file_url IS 'Maps to form field: taxPermitFile URL';
COMMENT ON COLUMN invoices.ein_file_name IS 'Maps to form field: idFile filename (Driver License/ID)';
COMMENT ON COLUMN invoices.ein_file_url IS 'Maps to form field: idFile URL (Driver License/ID)';
