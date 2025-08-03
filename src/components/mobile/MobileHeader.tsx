import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/header/Logo';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
  onMenuToggle?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  showProfile = true,
  onMenuToggle
}) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border md:hidden">
      <div className="safe-area-top">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side */}
          <div className="flex items-center space-x-3">
            {showBack ? (
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Logo />
            )}
            {title && (
              <h1 className="text-lg font-semibold text-foreground truncate">
                {title}
              </h1>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>

            {showProfile && user && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'У'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;