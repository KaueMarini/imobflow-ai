import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "CRM de Leads", href: "/crm", icon: Users },
  { title: "Imóveis", href: "/imoveis", icon: Building2 },
];

const configNavItems: NavItem[] = [
  { title: "Configurar Robô", href: "/robo", icon: Bot },
  { title: "Regras de Fontes", href: "/fontes", icon: Layers },
  { title: "Configurações", href: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground text-lg">
              ImobSaaS
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary mx-auto">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
              {!collapsed && (
                <span className="animate-fade-in">{item.title}</span>
              )}
            </NavLink>
          ))}
        </div>

        <Separator className="my-4 bg-sidebar-border" />

        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-muted">
              Configurações
            </p>
          )}
          {configNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
              {!collapsed && (
                <span className="animate-fade-in">{item.title}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground font-semibold text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                João da Imob
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                Plano Professional
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn(
            "w-full text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
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
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-sidebar-foreground" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-sidebar-foreground" />
        )}
      </Button>
    </aside>
  );
}
