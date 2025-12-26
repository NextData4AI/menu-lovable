import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicRestaurant {
  id: string;
  name: string;
  banner_image: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  business_hours: string | null;
}

export interface PublicCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface PublicDish {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  price: number;
  image: string;
  status: 'active' | 'inactive';
  sort_order: number;
}

export const usePublicMenu = () => {
  const { data: restaurants = [] } = useQuery({
    queryKey: ['public-restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .limit(1);
      if (error) throw error;
      return data as PublicRestaurant[];
    },
  });

  const restaurant = restaurants[0] || null;

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['public-categories', restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as PublicCategory[];
    },
    enabled: !!restaurant?.id,
  });

  const { data: dishes = [], isLoading: dishesLoading } = useQuery({
    queryKey: ['public-dishes', restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const categoryIds = categories.map(c => c.id);
      if (categoryIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .in('category_id', categoryIds)
        .eq('status', 'active')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as PublicDish[];
    },
    enabled: !!restaurant?.id && categories.length > 0,
  });

  // Group dishes by category
  const categoriesWithDishes = categories.map(category => ({
    ...category,
    dishes: dishes.filter(dish => dish.category_id === category.id),
  }));

  return {
    restaurant,
    categories: categoriesWithDishes,
    isLoading: categoriesLoading || dishesLoading,
  };
};
