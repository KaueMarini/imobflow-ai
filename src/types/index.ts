// Tenant (SaaS Client)
export interface ClienteSaas {
  id: string;
  nome_empresa: string;
  whatsapp_admin: string;
  instance_name: string;
  fontes_preferenciais: string[];
  fontes_secundarias: string[];
  plano: 'starter' | 'professional' | 'enterprise';
  created_at?: string;
}

// Lead (End Customer)
export type LeadStatus = 'novo' | 'atendimento' | 'visita' | 'fechado';

export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  interesse_bairro: string;
  orcamento_max: number;
  quartos: number;
  status: LeadStatus;
  cliente_saas_id: string;
  created_at?: string;
  updated_at?: string;
}

// Property
export interface ImovelUnico {
  id: string;
  titulo: string;
  preco: number;
  bairro: string;
  cidade: string;
  area_m2?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  link?: string;
  origem: string;
  itens_lazer?: string[];
  descricao?: string;
  created_at?: string;
  tipo?: string;
}

// Chat Message
export interface ChatMessage {
  id: string;
  lead_id: string;
  content: string;
  sender: 'lead' | 'bot' | 'agent';
  timestamp: string;
}

// Dashboard KPIs
export interface DashboardKPIs {
  totalLeads: number;
  leadsQuentes: number;
  imoveisRecomendados: number;
  taxaConversao: number;
}

// Source configuration
export interface FonteImobiliaria {
  id: string;
  nome: string;
  logo?: string;
  ativo: boolean;
}
