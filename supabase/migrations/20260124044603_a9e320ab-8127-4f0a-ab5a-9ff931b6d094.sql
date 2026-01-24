-- Cria tabela link_xml para armazenar os links XML por usuário
CREATE TABLE public.link_xml (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  url_xml TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilita RLS
ALTER TABLE public.link_xml ENABLE ROW LEVEL SECURITY;

-- Políticas para que usuários gerenciem apenas seus próprios links
CREATE POLICY "Usuários podem ver seus links XML"
ON public.link_xml FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus links XML"
ON public.link_xml FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus links XML"
ON public.link_xml FOR DELETE
USING (auth.uid() = user_id);