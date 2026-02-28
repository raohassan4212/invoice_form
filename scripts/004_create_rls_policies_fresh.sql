-- Enable Row Level Security on the invoices table
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for service role
CREATE POLICY "Allow all operations for service role" ON invoices
    FOR ALL USING (true);

-- Create policy for public read access (if needed)
CREATE POLICY "Allow public read access" ON invoices
    FOR SELECT USING (true);

-- Create policy for public insert access (for form submissions)
CREATE POLICY "Allow public insert access" ON invoices
    FOR INSERT WITH CHECK (true);
