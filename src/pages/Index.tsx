import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/menu/HeroSection';
import { CategoryNav } from '@/components/menu/CategoryNav';
import { CategorySection } from '@/components/menu/CategorySection';
import { Footer } from '@/components/menu/Footer';
import { usePublicMenu } from '@/hooks/usePublicMenu';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { restaurant, categories, isLoading } = usePublicMenu();
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    document.getElementById(`category-${categoryId}`)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const category of categories) {
        const element = document.getElementById(`category-${category.id}`);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Show loading state
  if (isLoading && !restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show empty state if no restaurant
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <h1 className="font-display text-4xl text-foreground mb-4">欢迎</h1>
        <p className="text-muted-foreground text-center mb-8">
          菜单正在准备中，请稍后再来
        </p>
        <a 
          href="/auth" 
          className="text-primary hover:underline"
        >
          管理员登录
        </a>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{restaurant.name} | 精致料理</title>
        <meta name="description" content={restaurant.description || ''} />
        <meta property="og:title" content={restaurant.name} />
        <meta property="og:description" content={restaurant.description || ''} />
        {restaurant.banner_image && (
          <meta property="og:image" content={restaurant.banner_image} />
        )}
      </Helmet>

      <main className="min-h-screen bg-background">
        <HeroSection restaurant={restaurant} />
        
        <div id="menu">
          {categories.length > 0 && (
            <>
              <CategoryNav 
                categories={categories} 
                activeCategory={activeCategory}
                onCategoryClick={handleCategoryClick}
              />

              {categories.map((category) => (
                <CategorySection key={category.id} category={category} />
              ))}
            </>
          )}

          {categories.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-muted-foreground">暂无菜品</p>
            </div>
          )}
        </div>

        <Footer restaurant={restaurant} />
      </main>
    </>
  );
};

export default Index;
