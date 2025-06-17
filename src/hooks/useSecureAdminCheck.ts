
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { isLovableDevelopment } from "@/utils/environmentDetection";
import { supabase } from "@/integrations/supabase/client";

export function useSecureAdminCheck() {
  const { user } = useSmartAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsLoading(false);
        return;
      }

      // In Lovable dev environment, automatically grant admin rights
      if (isLovableDevelopment() && user.id === 'dev-admin-lovable-12345') {
        console.log('🔧 Dev mode: Granting admin rights to dev user');
        setIsAdmin(true);
        setIsSuperAdmin(true);
        setIsLoading(false);
        return;
      }

      try {
        // Check basic admin status
        const { data: adminData, error: adminError } = await supabase.rpc('is_admin', {
          user_uuid: user.id
        });
        
        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
          setIsSuperAdmin(false);
        } else {
          const isAdminUser = adminData || false;
          setIsAdmin(isAdminUser);
          
          // If user is admin, check for super admin status
          if (isAdminUser) {
            const superAdminEmails = ['admin@example.com']; // Configure as needed
            setIsSuperAdmin(superAdminEmails.includes(user.email || ''));
          } else {
            setIsSuperAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsSuperAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  return { isAdmin, isSuperAdmin, isLoading };
}
