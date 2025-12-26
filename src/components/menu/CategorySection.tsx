import { Category } from '@/data/mockData';
import { DishCard } from './DishCard';

interface CategorySectionProps {
  category: Category;
}

export const CategorySection = ({ category }: CategorySectionProps) => {
  const activeDishes = category.dishes.filter(dish => dish.status === 'ACTIVE');

  return (
    <section id={`category-${category.id}`} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="text-center mb-12">
          {category.icon && (
            <span className="inline-block text-4xl mb-4">{category.icon}</span>
          )}
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">
            {category.name}
          </h2>
          {category.description && (
            <p className="font-body text-muted-foreground text-lg">
              {category.description}
            </p>
          )}
          <div className="w-24 h-0.5 gradient-warm mx-auto mt-6 rounded-full" />
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeDishes.map((dish, index) => (
            <DishCard key={dish.id} dish={dish} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
