/**
 * MobileHeader Component
 * 
 * Purpose: Top header for mobile app with logo and user profile
 * Features:
 * - Responsive logo display
 * - User profile section with score display
 * - Clean, professional design matching mobile app standards
 * - Gradient background for visual appeal
 */

import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const logoImage = "/lovable-uploads/19026e06-8cd5-4a2b-814f-ec7d51f16a33.png";

interface MobileHeaderProps {
  userScore?: number;
  userName?: string;
}

export function MobileHeader({ userScore = 0, userName = "Student" }: MobileHeaderProps) {
  return (
    <header className="bg-gradient-primary text-primary-foreground p-4 shadow-elevated">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img 
            src={logoImage} 
            alt="The Smart - Mathematics & Physics" 
            className="h-10 w-auto"
          />
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs opacity-90">Score: {userScore} pts</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
              <User size={16} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}