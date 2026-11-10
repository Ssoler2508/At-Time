-- Create leads table for pilot registration
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_negocio TEXT NOT NULL,
  tipo_negocio TEXT NOT NULL,
  zona_barrio TEXT NOT NULL,
  nombre_contacto TEXT NOT NULL,
  rol_contacto TEXT NOT NULL,
  contacto_directo TEXT NOT NULL,
  autorizacion_datos BOOLEAN NOT NULL DEFAULT false,
  fuente TEXT NOT NULL DEFAULT 'web_landing',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public insertion of new leads from landing page
CREATE POLICY "Allow public insert" ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Prevent public from reading leads
CREATE POLICY "Prevent public select" ON leads
  FOR SELECT
  TO public
  USING (false);

-- Prevent public from updating leads
CREATE POLICY "Prevent public update" ON leads
  FOR UPDATE
  TO public
  USING (false);

-- Prevent public from deleting leads
CREATE POLICY "Prevent public delete" ON leads
  FOR DELETE
  TO public
  USING (false);