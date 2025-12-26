import { Restaurant } from '@/data/mockData';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  restaurant: Restaurant;
}

export const HeroSection = ({ restaurant }: HeroSectionProps) => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${restaurant.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="inline-block text-primary font-body text-sm tracking-[0.3em] uppercase mb-6">
            欢迎光临
          </span>
        </div>
        
        <h1 
          className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          {restaurant.name}
        </h1>
        
        <p 
          className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          {restaurant.description}
        </p>

        <button
          onClick={scrollToMenu}
          className="group opacity-0 animate-fade-in"
          style={{ animationDelay: '0.8s' }}
        >
          <span className="inline-flex flex-col items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-300">
            <span className="font-body text-sm tracking-widest uppercase">浏览菜单</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </span>
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
