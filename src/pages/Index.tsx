import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/menu/HeroSection';
import { CategoryNav } from '@/components/menu/CategoryNav';
import { CategorySection } from '@/components/menu/CategorySection';
import { Footer } from '@/components/menu/Footer';
import { restaurant, categories } from '@/data/mockData';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

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
  }, []);

  return (
    <>
      <Helmet>
        <title>{restaurant.name} | 精致法式料理</title>
        <meta name="description" content={restaurant.description} />
        <meta property="og:title" content={restaurant.name} />
        <meta property="og:description" content={restaurant.description} />
        <meta property="og:image" content={restaurant.bannerImage} />
      </Helmet>

      <main className="min-h-screen bg-background">
        <HeroSection restaurant={restaurant} />
        
        <div id="menu">
          <CategoryNav 
            categories={categories} 
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />

          {categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>

        <Footer restaurant={restaurant} />
      </main>
    </>
  );
};

export default Index;
