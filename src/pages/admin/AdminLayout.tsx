import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, UtensilsCrossed, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/admin/categories', label: '类别管理', icon: LayoutGrid },
  { path: '/admin/dishes', label: '菜品管理', icon: UtensilsCrossed },
  { path: '/admin/settings', label: '主页配置', icon: Settings },
];

const AdminLayout = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="font-display text-lg text-foreground">菜单管理</h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h1 className="font-display text-xl text-foreground">菜单管理后台</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <Link to="/" className="block">
              <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-secondary">
                查看菜单
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
