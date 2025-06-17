
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useSecureAdminCheck() {
  const { user } = useAuth();
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
            // For now, we'll implement a simple check - you can enhance this later
            // Check if user has super_admin role or is in a super_admins table
            const { data: superAdminData, error: superAdminError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id)
              .eq('role', 'super_admin')
              .single();
            
            if (!superAdminError && superAdminData) {
              setIsSuperAdmin(true);
            } else {
              // Fallback: check if user email is in a predefined super admin list
              // You can configure this based on your needs
              const superAdminEmails = ['admin@example.com']; // Configure as needed
              setIsSuperAdmin(superAdminEmails.includes(user.email || ''));
            }
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
