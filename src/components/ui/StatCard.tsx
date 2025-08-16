/**
 * StatCard Component
 * 
 * Purpose: Reusable card component for displaying statistics and metrics
 * Features:
 * - Flexible icon and content display
 * - Gradient backgrounds for visual hierarchy
 * - Mobile-optimized spacing and typography
 * - Smooth hover animations
 */

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "primary" | "success";
  onClick?: () => void;
  className?: string;
}

export function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  variant = "default",
  onClick,
  className 
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card hover:bg-muted/50",
    primary: "bg-gradient-primary text-primary-foreground",
    success: "bg-gradient-success text-accent-foreground"
  };

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200 cursor-pointer shadow-card hover:shadow-elevated",
        variantStyles[variant],
        onClick && "hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className={cn(
          "p-2 rounded-lg",
          variant === "default" ? "bg-primary/10 text-primary" : "bg-white/20 text-current"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium",
            variant === "default" ? "text-muted-foreground" : "text-current opacity-90"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-xl font-bold mt-1",
            variant === "default" ? "text-foreground" : "text-current"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs mt-1",
              variant === "default" ? "text-muted-foreground" : "text-current opacity-75"
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}