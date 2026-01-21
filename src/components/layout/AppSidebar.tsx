import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bot,
  Layers,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
  CalendarDays,
  Plug,
  Satellite,
  Scale, // <--- ADICIONE ESTE IMPORT
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Agenda de Visitas", href: "/agenda", icon: CalendarDays },
  { title: "CRM de Leads", href: "/crm", icon: Users },
  { title: "Imóveis", href: "/imoveis", icon: Building2 },
  { title: "Radar Captação", href: "/captacao", icon: Satellite },
  { title: "Gerador de Avaliação", href: "/avaliacao", icon: FileText },
  { title: "Parceiros Jurídicos", href: "/parceiros", icon: Scale }, // <--- NOVO ITEM AQUI
];

const configNavItems: NavItem[] = [
  { title: "Configurar Robô", href: "/robo", icon: Bot },
  { title: "Regras de Fontes", href: "/fontes", icon: Layers },
  { title: "Integrações XML", href: "/integracoes", icon: Plug },
  { title: "Configurações", href: "/configuracoes", icon: Settings },
];

// ... (O resto do componente AppSidebar continua exatamente igual)
export function AppSidebar() {
  // ... mantenha o resto do código inalterado ...
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clienteSaas, signOut } = useAuth();
  
  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Dados reais do usuário
  const nomeEmpresa = clienteSaas?.nome_empresa || user?.user_metadata?.nome_empresa || "Minha Empresa";
  const plano = clienteSaas?.plano || "starter";
  const iniciais = nomeEmpresa.substring(0, 2).toUpperCase();

  const planoLabel = {
    starter: "Plano Starter",
    professional: "Plano Professional",
    enterprise: "Plano Enterprise",
    free: "Plano Free",
  }[plano] || `Plano ${plano}`;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col border-r border-sidebar-border shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border bg-sidebar-primary/5">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground text-lg tracking-tight">
              FlyImob
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto shadow-sm">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110")} />
              {!collapsed && (
                <span className="animate-fade-in truncate">{item.title}</span>
              )}
              {collapsed && isActive(item.href) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
              )}
            </NavLink>
          ))}
        </div>

        <Separator className="my-4 bg-sidebar-border/60" />

        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-muted/80">
              Ferramentas
            </p>
          )}
          {configNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110")} />
              {!collapsed && (
                <span className="animate-fade-in truncate">{item.title}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3 bg-sidebar-accent/10">
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2 bg-sidebar-accent/50 border border-sidebar-border/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
              {iniciais}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {nomeEmpresa}
              </p>
              <p className="text-[10px] text-sidebar-muted truncate uppercase tracking-wide font-medium">
                {planoLabel}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={handleSignOut}
          className={cn(
            "w-full text-sidebar-muted hover:text-destructive hover:bg-destructive/10 transition-colors",
            collapsed && "justify-center"
          )}
          title="Sair do sistema"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent hover:text-primary z-50 p-0"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}