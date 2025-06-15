
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const findUserByEmail = async (supabase: any, userEmail: string) => {
  const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error('Error fetching users:', userError);
    throw new Error('Error fetching user data');
  }

  const user = userData.users.find((u: any) => u.email === userEmail);
  
  if (!user) {
    console.error('User not found with email:', userEmail);
    throw new Error('User not found');
  }

  console.log('Found user ID:', user.id, 'for email:', userEmail);
  return user;
};
