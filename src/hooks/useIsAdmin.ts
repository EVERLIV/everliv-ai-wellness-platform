
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      console.log('Starting admin check, user:', user);
      
      if (!user) {
        console.log('No user found, setting admin to false');
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Проверяем админа по email адресу
        const adminEmails = [
          '1111hoaandrey@gmail.com',
          'admin@everliv.ru'
        ];
        
        console.log('User email:', user.email);
        console.log('Admin emails list:', adminEmails);
        
        const isUserAdmin = adminEmails.includes(user.email || '');
        console.log('Is user admin?', isUserAdmin);
        
        setIsAdmin(isUserAdmin);
        
        console.log('Admin check completed:', {
          userEmail: user.email,
          isAdmin: isUserAdmin,
          isLoading: false
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  console.log('useIsAdmin hook returning:', { isAdmin, isLoading });
  
  return { isAdmin, isLoading };
}
