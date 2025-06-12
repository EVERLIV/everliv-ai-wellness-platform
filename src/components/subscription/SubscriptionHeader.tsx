
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from 'lucide-react';

const SubscriptionHeader = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="flex items-center gap-2 hover:bg-white/80 px-2 py-1 text-sm"
            >
              <Link to="/dashboard">
                <ArrowLeft className="h-3 w-3" />
                <span className="hidden sm:inline">Назад к панели</span>
                <span className="sm:hidden">Назад</span>
              </Link>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                <Crown className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-0">
                  Подписки
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Выберите подходящий план для доступа ко всем возможностям
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHeader;
