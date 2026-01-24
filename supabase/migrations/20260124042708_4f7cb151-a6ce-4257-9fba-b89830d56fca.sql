-- Adiciona coluna evolution_status na tabela cliente_saas
ALTER TABLE public.cliente_saas 
ADD COLUMN IF NOT EXISTS evolution_status text DEFAULT NULL;