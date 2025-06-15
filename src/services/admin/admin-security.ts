
import { supabase } from "@/integrations/supabase/client";

// Безопасная проверка прав администратора через серверную функцию
export async function checkAdminAccess(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Пользователь не авторизован");
  }

  try {
    // Используем серверную RPC функцию для проверки
    const { data, error } = await supabase.rpc('is_admin', {
      user_uuid: user.id
    });
    
    if (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in admin access check:', error);
    return false;
  }
}
