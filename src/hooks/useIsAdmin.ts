
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
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
        
        const isUserAdmin = adminEmails.includes(user.email || '');
        setIsAdmin(isUserAdmin);
        
        console.log('Admin check:', {
          userEmail: user.email,
          isAdmin: isUserAdmin
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

  return { isAdmin, isLoading };
}
