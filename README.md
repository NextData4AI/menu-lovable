# 🍽️ Menu Lovable - 餐厅菜单管理系统

一个现代化的餐厅菜单展示和管理系统，支持在线菜单浏览和后台管理功能。

## ✨ 功能特性

### 🌟 前台功能
- **响应式菜单展示** - 适配各种设备的精美菜单界面
- **分类导航** - 智能分类导航，支持滚动定位
- **菜品详情** - 高清图片、详细描述、价格展示
- **餐厅信息** - 地址、电话、营业时间等信息展示
- **SEO 优化** - 完整的 meta 标签和 Open Graph 支持

### 🔧 后台管理
- **用户认证** - 安全的管理员登录系统
- **分类管理** - 添加、编辑、删除菜品分类
- **菜品管理** - 完整的菜品 CRUD 操作
- **餐厅设置** - 餐厅基本信息配置
- **实时预览** - 修改后即时查看效果

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 本地开发

```bash
# 克隆项目
git clone <YOUR_GIT_URL>
cd menu-lovable

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:8080` 查看应用

### 环境配置

项目使用 Supabase 作为后端服务，需要配置以下环境变量：

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
```

## 🛠️ 技术栈

### 前端框架
- **React 18** - 现代化的用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具

### UI 组件
- **shadcn/ui** - 高质量的 React 组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 精美的图标库

### 状态管理
- **TanStack Query** - 强大的数据获取和缓存
- **React Hook Form** - 高性能的表单处理
- **Zod** - TypeScript 优先的模式验证

### 后端服务
- **Supabase** - 开源的 Firebase 替代方案
- **PostgreSQL** - 可靠的关系型数据库
- **Row Level Security** - 数据安全保护

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── menu/           # 菜单相关组件
│   └── ui/             # UI 基础组件
├── contexts/           # React Context
├── hooks/              # 自定义 Hooks
├── pages/              # 页面组件
│   └── admin/          # 管理后台页面
├── lib/                # 工具函数
├── data/               # 模拟数据
└── integrations/       # 第三方集成
    └── supabase/       # Supabase 配置
```

## 🎯 主要页面

- `/` - 菜单展示页面
- `/auth` - 管理员登录
- `/setup` - 初始化设置
- `/admin` - 管理后台首页
- `/admin/categories` - 分类管理
- `/admin/dishes` - 菜品管理
- `/admin/settings` - 系统设置

## 📝 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 开发模式构建
npm run build:dev

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

## 🚀 部署

### Lovable 平台部署
1. 访问 [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. 点击 Share -> Publish
3. 按照提示完成部署

### 其他平台部署
项目支持部署到任何静态托管平台：
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔧 开发指南

### 添加新菜品分类
1. 在管理后台的分类管理页面添加
2. 或直接修改 `src/data/mockData.ts` 文件

### 自定义主题
- 修改 `tailwind.config.ts` 配置主题色彩
- 在 `src/index.css` 中调整 CSS 变量

### 添加新页面
1. 在 `src/pages/` 目录创建新组件
2. 在 `src/App.tsx` 中添加路由配置

## 🐛 常见问题

### 依赖安装失败
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 端口被占用
```bash
# 使用其他端口启动
npm run dev -- --port 3000
```

### 安全漏洞警告
```bash
# 自动修复安全漏洞
npm audit fix
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔗 相关链接

- [Lovable 平台](https://lovable.dev)
- [Supabase 文档](https://supabase.com/docs)
- [shadcn/ui 组件](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
