import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useDishes, Dish } from '@/hooks/useDishes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, GripVertical, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

const DishesPage = () => {
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { dishes, isLoading, createDish, updateDish, deleteDish, reorderDishes } = useDishes(
    selectedCategory === 'all' ? undefined : selectedCategory
  );
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    price: '',
    image: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [uploading, setUploading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

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
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image: publicUrl });
      toast({ title: '成功', description: '图片上传成功' });
    } catch (error) {
      toast({ title: '错误', description: '图片上传失败', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({ title: '错误', description: '菜品名称不能为空', variant: 'destructive' });
      return;
    }
    if (!formData.category_id) {
      toast({ title: '错误', description: '请选择类别', variant: 'destructive' });
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({ title: '错误', description: '请输入有效的价格', variant: 'destructive' });
      return;
    }
    if (!formData.image) {
      toast({ title: '错误', description: '请上传菜品图片', variant: 'destructive' });
      return;
    }

    try {
      const dishData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingDish) {
        await updateDish.mutateAsync({ id: editingDish.id, ...dishData });
        toast({ title: '成功', description: '菜品已更新' });
      } else {
        await createDish.mutateAsync(dishData);
        toast({ title: '成功', description: '菜品已创建' });
      }
      setIsDialogOpen(false);
      setEditingDish(null);
      setFormData({ category_id: '', title: '', description: '', price: '', image: '', status: 'active' });
    } catch (error) {
      toast({ title: '错误', description: '操作失败', variant: 'destructive' });
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      category_id: dish.category_id,
      title: dish.title,
      description: dish.description || '',
      price: dish.price.toString(),
      image: dish.image,
      status: dish.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDish.mutateAsync(id);
      toast({ title: '成功', description: '菜品已删除' });
    } catch (error) {
      toast({ title: '错误', description: '删除失败', variant: 'destructive' });
    }
  };

  const handleStatusToggle = async (dish: Dish) => {
    try {
      await updateDish.mutateAsync({
        id: dish.id,
        status: dish.status === 'active' ? 'inactive' : 'active',
      });
      toast({ title: '成功', description: `菜品已${dish.status === 'active' ? '下架' : '上架'}` });
    } catch (error) {
      toast({ title: '错误', description: '操作失败', variant: 'destructive' });
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    
    const sameCategoryDishes = dishes.filter(d => d.category_id === dishes.find(x => x.id === draggedId)?.category_id);
    const newOrder = [...sameCategoryDishes];
    const draggedIndex = newOrder.findIndex(d => d.id === draggedId);
    const targetIndex = newOrder.findIndex(d => d.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    
    reorderDishes.mutate(newOrder.map(d => d.id));
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display text-foreground">菜品管理</h1>
          <p className="text-muted-foreground">管理菜单中的菜品</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
              <SelectValue placeholder="筛选类别" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">全部类别</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingDish(null);
              setFormData({ category_id: '', title: '', description: '', price: '', image: '', status: 'active' });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                添加菜品
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">{editingDish ? '编辑菜品' : '添加菜品'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">类别 *</Label>
                  <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">菜品名称 *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="例如：宫保鸡丁"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">描述</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="菜品描述"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">价格 *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="例如：38.00"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">图片 *</Label>
                  <div className="flex gap-4">
                    {formData.image ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg border border-dashed border-border flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          <span>{uploading ? '上传中...' : '上传图片'}</span>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-2">支持 JPG、PNG，最大 5MB</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">上架状态</Label>
                  <Switch
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border">
                  取消
                </Button>
                <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
                  {editingDish ? '保存' : '创建'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {dishes.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">暂无菜品，请添加您的第一个菜品</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              添加菜品
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {dishes.map((dish) => (
            <Card
              key={dish.id}
              draggable
              onDragStart={() => handleDragStart(dish.id)}
              onDragOver={(e) => handleDragOver(e, dish.id)}
              onDragEnd={handleDragEnd}
              className={`bg-card border-border cursor-move transition-opacity ${draggedId === dish.id ? 'opacity-50' : ''} ${dish.status === 'inactive' ? 'opacity-60' : ''}`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={dish.image} alt={dish.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">{dish.title}</h3>
                    {dish.status === 'inactive' && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">已下架</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{dish.description}</p>
                  <p className="text-primary font-medium">¥{dish.price}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={dish.status === 'active'}
                    onCheckedChange={() => handleStatusToggle(dish)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(dish)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要删除此菜品吗？此操作不可撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(dish.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          删除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DishesPage;
