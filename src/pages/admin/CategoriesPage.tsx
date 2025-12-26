import { useState } from 'react';
import { useCategories, Category } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react';

const CategoriesPage = () => {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory, reorderCategories } = useCategories();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: '错误', description: '类别名称不能为空', variant: 'destructive' });
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, ...formData });
        toast({ title: '成功', description: '类别已更新' });
      } else {
        await createCategory.mutateAsync(formData);
        toast({ title: '成功', description: '类别已创建' });
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: '' });
    } catch (error) {
      toast({ title: '错误', description: '操作失败', variant: 'destructive' });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '', icon: category.icon || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast({ title: '成功', description: '类别已删除' });
    } catch (error) {
      toast({ title: '错误', description: '删除失败', variant: 'destructive' });
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    
    const newOrder = [...categories];
    const draggedIndex = newOrder.findIndex(c => c.id === draggedId);
    const targetIndex = newOrder.findIndex(c => c.id === targetId);
    
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    
    reorderCategories.mutate(newOrder.map(c => c.id));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-foreground">类别管理</h1>
          <p className="text-muted-foreground">管理菜单类别，拖拽可调整顺序</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCategory(null);
            setFormData({ name: '', description: '', icon: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              添加类别
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">{editingCategory ? '编辑类别' : '添加类别'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">类别名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：开胃菜"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="可选的类别描述"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">图标</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="例如：🍽️"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border">
                取消
              </Button>
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
                {editingCategory ? '保存' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">暂无类别，请添加您的第一个类别</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              添加类别
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              draggable
              onDragStart={() => handleDragStart(category.id)}
              onDragOver={(e) => handleDragOver(e, category.id)}
              onDragEnd={handleDragEnd}
              className={`bg-card border-border cursor-move transition-opacity ${draggedId === category.id ? 'opacity-50' : ''}`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
                {category.icon && <span className="text-2xl">{category.icon}</span>}
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
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
                          删除此类别将同时删除其下所有菜品，此操作不可撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;
