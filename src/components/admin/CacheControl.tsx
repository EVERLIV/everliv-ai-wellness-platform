
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CacheControlProps {
  onRefresh?: () => void;
}

const CacheControl: React.FC<CacheControlProps> = ({ onRefresh }) => {
  const handleClearCache = () => {
    // Clear application cache
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    // Force reload with cache bypass
    window.location.reload();
    
    toast("Кэш очищен", {
      description: "Страница перезагружается с обновленными данными",
    });
    
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleClearCache}
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-4 w-4" />
        Обновить кэш
      </Button>
    </div>
  );
};

export default CacheControl;
