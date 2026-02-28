-- Update field references from THC-A to 7-Hydroxymitragynine (7-OH)
-- This maintains the existing database column name but updates documentation

COMMENT ON COLUMN invoices.thc_a_legal IS 'Whether 7-Hydroxymitragynine (7-OH) is legal in customer state (Yes/No)';

-- Note: Database column name remains 'thc_a_legal' for backward compatibility
-- but the field now represents 7-Hydroxymitragynine legality status
