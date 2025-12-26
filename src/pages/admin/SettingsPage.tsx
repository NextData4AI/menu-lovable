import { useState, useEffect } from 'react';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, Image as ImageIcon, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const { restaurant, isLoading, updateRestaurant } = useRestaurant();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    banner_image: '',
    address: '',
    phone: '',
    business_hours: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        banner_image: restaurant.banner_image || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        business_hours: restaurant.business_hours || '',
      });
    }
  }, [restaurant]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: '错误', description: '图片大小不能超过5MB', variant: 'destructive' });
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({ title: '错误', description: '仅支持JPG和PNG格式', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileName = `banner-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, banner_image: publicUrl });
      toast({ title: '成功', description: '图片上传成功' });
    } catch (error) {
      toast({ title: '错误', description: '图片上传失败', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: '错误', description: '餐厅名称不能为空', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      await updateRestaurant.mutateAsync(formData);
      toast({ title: '成功', description: '设置已保存' });
    } catch (error) {
      toast({ title: '错误', description: '保存失败', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">暂无餐厅信息，请先创建餐厅</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-foreground">主页配置</h1>
          <p className="text-muted-foreground">配置菜单主页的展示内容</p>
        </div>
        <Link to="/" target="_blank">
          <Button variant="outline" className="border-border">
            <Eye className="w-4 h-4 mr-2" />
            预览菜单
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 基本信息 */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">基本信息</CardTitle>
            <CardDescription>设置餐厅的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">餐厅名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="您的餐厅名称"
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">餐厅简介</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="介绍您的餐厅..."
                rows={4}
                className="bg-input border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* 横幅图片 */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">横幅图片</CardTitle>
            <CardDescription>建议尺寸：1920x400px</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.banner_image ? (
              <div className="relative aspect-[4/1] rounded-lg overflow-hidden border border-border">
                <img src={formData.banner_image} alt="Banner" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/1] rounded-lg border border-dashed border-border flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <Label htmlFor="banner-upload" className="cursor-pointer block">
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{uploading ? '上传中...' : '上传横幅图片'}</span>
              </div>
              <input
                id="banner-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </Label>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">联系信息</CardTitle>
            <CardDescription>设置餐厅的联系方式</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-foreground">地址</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="餐厅地址"
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">电话</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="联系电话"
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">营业时间</Label>
              <Input
                value={formData.business_hours}
                onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
                placeholder="例如：10:00 - 22:00"
                className="bg-input border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          保存设置
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
