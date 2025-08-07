
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";
import { isDevelopmentMode } from "@/utils/devMode";

export function useIsAdmin() {
  const { user } = useSmartAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // В dev режиме автоматически предоставляем админ права для dev пользователя
      if (isDevelopmentMode() && user.id === '00000000-0000-0000-0000-000000000001') {
        console.log('🔧 Dev mode: Granting admin access to dev user');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      try {
        // Безопасная серверная проверка через RPC функцию
        const { data, error } = await supabase.rpc('is_admin', {
          user_uuid: user.id
        });
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  return { isAdmin, isLoading };
}
