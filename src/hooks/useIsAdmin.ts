
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
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
          // Check user metadata instead of profiles table role field
          setIsAdmin(user.user_metadata?.role === 'admin' || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, isLoading };
};
