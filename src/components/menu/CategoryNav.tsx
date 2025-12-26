import { PublicCategory } from '@/hooks/usePublicMenu';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  categories: PublicCategory[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export const CategoryNav = ({ categories, activeCategory, onCategoryClick }: CategoryNavProps) => {
  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm whitespace-nowrap transition-all duration-300",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary/50 text-foreground/70 hover:bg-secondary hover:text-foreground"
              )}
            >
              {category.icon && <span className="text-base">{category.icon}</span>}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
