
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user || !isAuthenticated) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // First check for admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select()
          .eq('user_id', user.id)
          .single();
          
        if (!adminError && adminData) {
          setIsAdmin(true);
        } else {
          // If not found in admin_users, check using the is_admin function
          const { data: functionData, error: functionError } = await supabase
            .rpc('is_admin', { user_uuid: user.id });
            
          setIsAdmin(functionError ? false : !!functionData);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, isAuthenticated]);

  return { isAdmin, isLoading };
};
