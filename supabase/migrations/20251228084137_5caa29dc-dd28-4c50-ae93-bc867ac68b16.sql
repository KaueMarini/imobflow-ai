-- Criar tabela cliente_saas com todos os campos mencionados + user_id
CREATE TABLE public.cliente_saas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_empresa TEXT,
  instance_name TEXT,
  plano TEXT,
  status_pagamento TEXT,
  mensagem_boas_vindas TEXT,
  telefone_admin TEXT,
  fontes_preferenciais TEXT[],
  fontes_secundarias TEXT[]
);

-- Habilitar RLS na tabela cliente_saas
ALTER TABLE public.cliente_saas ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só podem ver sua própria linha
CREATE POLICY "Usuários podem ver seu próprio cliente_saas"
ON public.cliente_saas
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuários só podem atualizar sua própria linha
CREATE POLICY "Usuários podem atualizar seu próprio cliente_saas"
ON public.cliente_saas
FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Usuários só podem inserir com seu próprio user_id
CREATE POLICY "Usuários podem inserir seu próprio cliente_saas"
ON public.cliente_saas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só podem deletar sua própria linha
CREATE POLICY "Usuários podem deletar seu próprio cliente_saas"
ON public.cliente_saas
FOR DELETE
USING (auth.uid() = user_id);

-- Função para criar cliente_saas automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user_cliente_saas()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.cliente_saas (user_id, nome_empresa, plano, status_pagamento)
  VALUES (new.id, new.raw_user_meta_data ->> 'nome_empresa', 'free', 'pendente');
  RETURN new;
END;
$$;

-- Trigger para criar cliente_saas quando novo usuário é criado
CREATE TRIGGER on_auth_user_created_cliente_saas
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_cliente_saas();