import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Dish {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  price: number;
  image: string;
  status: 'active' | 'inactive';
  sort_order: number;
}

export const useDishes = (categoryId?: string) => {
  const queryClient = useQueryClient();

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('dishes')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Dish[];
    },
  });

  const createDish = useMutation({
    mutationFn: async (dish: Omit<Dish, 'id' | 'sort_order'>) => {
      const existingDishes = dishes.filter(d => d.category_id === dish.category_id);
      const maxOrder = existingDishes.length > 0 ? Math.max(...existingDishes.map(d => d.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from('dishes')
        .insert({ ...dish, sort_order: maxOrder })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  const updateDish = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Dish> & { id: string }) => {
      const { error } = await supabase
        .from('dishes')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  const deleteDish = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  const reorderDishes = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, index) => 
        supabase.from('dishes').update({ sort_order: index }).eq('id', id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  return {
    dishes,
    isLoading,
    createDish,
    updateDish,
    deleteDish,
    reorderDishes,
  };
};
