-- Drop the recursive policy
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.user_roles;

-- Create a security definer function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID, _restaurant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
    AND restaurant_id = _restaurant_id 
    AND role = 'super'
  )
$$;

-- Create non-recursive policies for user_roles
CREATE POLICY "Super admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin(auth.uid(), restaurant_id));

CREATE POLICY "Super admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_super_admin(auth.uid(), restaurant_id));

CREATE POLICY "Super admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_super_admin(auth.uid(), restaurant_id));