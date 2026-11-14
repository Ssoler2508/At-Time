-- Add fecha_autorizacion column and tighten constraints
ALTER TABLE leads ADD COLUMN fecha_autorizacion TIMESTAMPTZ;

-- Allow nulls temporarily for existing rows, with partial check
ALTER TABLE leads ADD CONSTRAINT leads_autorizacion_check
  CHECK ( (autorizacion_datos = true AND fecha_autorizacion IS NOT NULL) OR autorizacion_datos IS NULL )
  NOT VALID;

-- Drop public insert policy
DROP POLICY IF EXISTS "Allow public insert" ON leads;

-- Revoke anon and authenticated privileges
REVOKE ALL ON leads FROM anon;
REVOKE ALL ON leads FROM authenticated;

-- Create unique index for duplicate prevention (regla 4)
CREATE UNIQUE INDEX IF NOT EXISTS leads_uniq_nombre_zona_contacto
  ON leads (lower(nombre_negocio), lower(zona_barrio), contacto_directo);