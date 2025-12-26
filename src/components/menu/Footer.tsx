import { PublicRestaurant } from '@/hooks/usePublicMenu';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  restaurant: PublicRestaurant;
}

export const Footer = ({ restaurant }: FooterProps) => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Restaurant Info */}
          <div>
            <h3 className="font-display text-2xl font-medium mb-6 text-gradient">
              {restaurant.name}
            </h3>
            {restaurant.description && (
              <p className="font-body text-muted-foreground leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-medium mb-6">联系我们</h4>
            <ul className="space-y-4">
              {restaurant.phone && (
                <li>
                  <a 
                    href={`tel:${restaurant.phone}`}
                    className="flex items-start gap-3 font-body text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Phone className="w-5 h-5 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <span>{restaurant.phone}</span>
                  </a>
                </li>
              )}
              {restaurant.address && (
                <li className="flex items-start gap-3 font-body text-muted-foreground">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <span>{restaurant.address}</span>
                </li>
              )}
              {restaurant.business_hours && (
                <li className="flex items-start gap-3 font-body text-muted-foreground">
                  <Clock className="w-5 h-5 mt-0.5 text-primary" />
                  <span>{restaurant.business_hours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social & Follow */}
          <div>
            <h4 className="font-display text-lg font-medium mb-6">关注我们</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            
            {restaurant.phone && (
              <div className="mt-8">
                <p className="font-body text-sm text-muted-foreground mb-3">
                  预订座位或私人活动
                </p>
                <a 
                  href={`tel:${restaurant.phone}`}
                  className="inline-flex items-center gap-2 gradient-warm text-primary-foreground px-6 py-3 rounded-full font-body text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Phone className="w-4 h-4" />
                  立即预约
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </p>
          <a href="/auth" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
            管理后台
          </a>
        </div>
      </div>
    </footer>
  );
};
