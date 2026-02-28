-- Create payment logs table for tracking payment attempts
CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id TEXT,
    invoice_number TEXT,
    amount DECIMAL(10,2) DEFAULT 0.00,
    response_code TEXT,
    response_text TEXT,
    auth_code TEXT,
    test_request BOOLEAN DEFAULT false,
    webhook_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payment logs
CREATE INDEX IF NOT EXISTS idx_payment_logs_transaction_id ON payment_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_invoice_number ON payment_logs(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at);

-- Enable RLS on payment logs
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for payment logs
CREATE POLICY "Allow all operations for service role" ON payment_logs
    FOR ALL USING (true);
