import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ChefHat, UtensilsCrossed } from 'lucide-react';
import { useRestaurant } from '@/hooks/useRestaurant';

const SetupPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { restaurant, isLoading: restaurantLoading } = useRestaurant();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSetup = async () => {
    if (!user) {
      toast({ title: '请先登录', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    setIsSettingUp(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('setup-restaurant', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({ title: '成功', description: response.data.message });
      
      // Redirect to admin dashboard
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } catch (error: any) {
      toast({ 
        title: '错误', 
        description: error.message || '设置失败，请重试', 
        variant: 'destructive' 
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  if (authLoading || restaurantLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">请先登录</CardTitle>
            <CardDescription>您需要登录后才能进行初始化设置</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-primary text-primary-foreground"
              onClick={() => navigate('/auth')}
            >
              前往登录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">您已经是管理员</CardTitle>
            <CardDescription>餐厅已创建，您可以直接进入管理后台</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-primary text-primary-foreground"
              onClick={() => navigate('/admin')}
            >
              进入管理后台
            </Button>
            <Button 
              variant="outline"
              className="w-full border-border"
              onClick={() => navigate('/')}
            >
              查看菜单
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card border-border">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-warm flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-display">初始化餐厅</CardTitle>
          <CardDescription className="text-base mt-2">
            一键创建示例餐厅、菜品分类和菜品数据，并将您设为超级管理员
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">5 个分类</p>
              <p className="text-sm text-muted-foreground">开胃菜、热菜等</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <ChefHat className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">16+ 道菜品</p>
              <p className="text-sm text-muted-foreground">含图片和描述</p>
            </div>
          </div>

          <Button
            className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSetup}
            disabled={isSettingUp}
          >
            {isSettingUp ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                正在初始化...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                开始初始化
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            初始化后您可以在管理后台修改所有内容
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupPage;
