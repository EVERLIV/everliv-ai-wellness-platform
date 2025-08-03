import React from 'react';
import { Bell, Search, ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = "EVERLIV",
  subtitle,
  showBack = false,
  onBack
}) => {
  const { user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-b-3xl md:hidden">
      <div className="safe-area-top">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="text-white hover:bg-white/20 p-0"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            ) : (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-emerald-500" />
              </div>
            )}
            {!showBack && <span className="font-bold text-lg">{title}</span>}
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6" />
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                3
              </span>
            </div>
          </div>
        </div>
        
        {(showBack && title) && (
          <>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            {subtitle && <p className="text-white/90">{subtitle}</p>}
          </>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;