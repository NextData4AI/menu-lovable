import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Restaurant {
  id: string;
  name: string;
  banner_image: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  business_hours: string | null;
  social_links: Record<string, string> | null;
}

export const useRestaurant = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_roles')
        .select('restaurant_id, role')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', userRole?.restaurant_id],
    queryFn: async () => {
      if (!userRole?.restaurant_id) return null;
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', userRole.restaurant_id)
        .single();
      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!userRole?.restaurant_id,
  });

  const updateRestaurant = useMutation({
    mutationFn: async (updates: Partial<Restaurant>) => {
      if (!restaurant?.id) throw new Error('No restaurant');
      const { error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', restaurant.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
    },
  });

  return {
    restaurant,
    userRole,
    isLoading,
    updateRestaurant,
  };
};
