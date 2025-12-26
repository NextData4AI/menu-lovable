import { Dish } from '@/data/mockData';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface DishCardProps {
  dish: Dish;
  index: number;
}

export const DishCard = ({ dish, index }: DishCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <article 
        className="group cursor-pointer opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-card">
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          
          <img
            src={dish.image}
            alt={dish.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full font-body text-sm font-medium">
            ¥{dish.price}
          </div>
        </div>

        <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors duration-300">
          {dish.title}
        </h3>
        
        <p className="font-body text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {dish.description}
        </p>
      </article>

      {/* Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border">
          <div className="aspect-video relative">
            <img
              src={dish.image}
              alt={dish.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
          
          <div className="p-6 pt-0 -mt-16 relative">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-display text-3xl font-medium">{dish.title}</h2>
              <span className="gradient-warm text-primary-foreground px-4 py-2 rounded-full font-body text-lg font-semibold">
                ¥{dish.price}
              </span>
            </div>
            
            <p className="font-body text-muted-foreground leading-relaxed text-lg">
              {dish.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
