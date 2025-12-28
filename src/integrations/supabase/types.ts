// src/types/index.ts

export interface ImovelSantos {
  id: number;
  titulo: string;
  preco: number;
  bairro: string | null;
  quartos: number;
  area_m2: number;
  vagas: number;
  imagem_url: string | null;
  link: string;
  origem: string;
}

export interface Lead {
  id: string;
  user_id: string;
  nome: string;
  whatsapp: string;
  interesse_bairro: string;
  orcamento_max: number;
  quartos: number;
  status: 'novo' | 'atendimento' | 'visita' | 'fechado' | 'arquivado';
  created_at: string;
}

export interface ClienteSaas {
  id: string;
  user_id: string;
  nome_empresa: string;
  whatsapp: string | null;
  fontes_preferenciais: string[];
  evolution_status: 'disconnected' | 'connecting' | 'connected';
  evolution_instance_name: string | null;
  plano: string;
}