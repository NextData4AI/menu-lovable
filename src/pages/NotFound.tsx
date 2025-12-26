import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl font-medium text-gradient mb-4">404</h1>
        <p className="font-body text-xl text-muted-foreground mb-8">
          页面未找到
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 gradient-warm text-primary-foreground px-8 py-3 rounded-full font-body text-base font-medium hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
