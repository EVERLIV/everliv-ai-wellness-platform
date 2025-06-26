
-- Удаляем все дублирующиеся политики для user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Создаем оптимизированные политики для SELECT
-- Пользователи могут видеть свои роли, админы могут видеть все роли
CREATE POLICY "Users can view roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (
    (select auth.uid()) = user_id 
    OR public.has_role((select auth.uid()), 'admin'::public.app_role)
  );

-- Проверяем и оптимизируем политики для других операций
DROP POLICY IF EXISTS "Admins can create user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;

-- Создаем оптимизированную политику для INSERT (только админы)
CREATE POLICY "Admins can create user roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- Проверяем политики для UPDATE
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can modify user roles" ON public.user_roles;

-- Создаем оптимизированную политику для UPDATE (только админы)
CREATE POLICY "Admins can update user roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- Проверяем политики для DELETE
DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can remove user roles" ON public.user_roles;

-- Создаем оптимизированную политику для DELETE (только админы)
CREATE POLICY "Admins can delete user roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (public.has_role((select auth.uid()), 'admin'::public.app_role));
