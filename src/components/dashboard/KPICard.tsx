import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
}: KPICardProps) {
  const variantStyles = {
    default: "bg-card",
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
  };

  const iconBgStyles = {
    default: "bg-accent text-accent-foreground",
    primary: "bg-primary-foreground/20 text-primary-foreground",
    success: "bg-success-foreground/20 text-success-foreground",
    warning: "bg-warning-foreground/20 text-warning-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-6 shadow-soft card-hover",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "mt-1 text-sm",
                variant === "default" ? "text-muted-foreground" : "opacity-70"
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span
                className={cn(
                  "text-xs",
                  variant === "default" ? "text-muted-foreground" : "opacity-70"
                )}
              >
                vs. mês passado
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            iconBgStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
