/**
 * MobileNavigation Component
 * 
 * Purpose: Bottom navigation bar for mobile app experience
 * Features:
 * - Fixed bottom position for thumb-friendly navigation
 * - Active state highlighting with smooth animations
 * - Icons and labels for clear navigation context
 * - Mobile-optimized touch targets (minimum 44px)
 */

import { Home, BookOpen, Brain, Users, Trophy, Calendar, Play, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "الرئيسية", path: "/" },
  { icon: Calendar, label: "اختبار يومي", path: "/daily-quiz" },
  { icon: Play, label: "فيديوات", path: "/video-learning" },
  { icon: Brain, label: "تعلم مع AI", path: "/learn-ai" },
  { icon: Trophy, label: "امتحانات", path: "/exams" },
  { icon: Users, label: "الطلاب", path: "/students" },
  { icon: User, label: "الملف الشخصي", path: "/profile" },
];

export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navigationItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] min-h-[60px]",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform duration-200",
                  isActive ? "scale-110" : ""
                )} 
              />
              <span className={cn(
                "text-xs font-medium mt-1 transition-colors duration-200",
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}