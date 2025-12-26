export interface Dish {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  dishes: Dish[];
}

export interface Restaurant {
  id: string;
  name: string;
  bannerImage: string;
  description: string;
  address: string;
  phone: string;
  openingHours: string;
}

export const restaurant: Restaurant = {
  id: '1',
  name: 'Maison Dorée',
  bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
  description: '在 Maison Dorée，我们以精选食材和匠心工艺，为您呈现融合东西方风味的现代法式料理。每一道菜品都是一场味觉与视觉的双重盛宴。',
  address: '上海市静安区南京西路1788号国际中心18楼',
  phone: '+86 21 6288 8888',
  openingHours: '周一至周日 11:30 - 22:00',
};

export const categories: Category[] = [
  {
    id: '1',
    name: '开胃前菜',
    description: '精致开胃，唤醒味蕾',
    icon: '🥗',
    dishes: [
      {
        id: '1',
        title: '鹅肝慕斯配无花果',
        description: '法式鹅肝慕斯，搭配蜜渍无花果与松露蜂蜜，轻盈细腻',
        price: 188,
        image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '2',
        title: '帝王蟹塔塔',
        description: '阿拉斯加帝王蟹肉配牛油果慕斯，柠檬橄榄油调味',
        price: 268,
        image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '3',
        title: '生蚝三重奏',
        description: '法国吉拉多、澳洲悉尼岩蚝、日本�的矢牡蛎，三种风味',
        price: 328,
        image: 'https://images.unsplash.com/photo-1567117773952-9d1f3fb50a9a?w=800&q=80',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: '2',
    name: '汤品',
    description: '温暖滋养，浓郁醇厚',
    icon: '🍲',
    dishes: [
      {
        id: '4',
        title: '黑松露野菌浓汤',
        description: '多种野生菌菇慢煮，佐以新鲜黑松露片',
        price: 128,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '5',
        title: '龙虾浓汤',
        description: '波士顿龙虾熬制，鲜奶油调和，干邑提香',
        price: 168,
        image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&q=80',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: '3',
    name: '主菜',
    description: '匠心之作，味觉巅峰',
    icon: '🍽️',
    dishes: [
      {
        id: '6',
        title: '和牛牛排',
        description: 'A5级日本和牛，低温慢煮后高温炙烤，配时令蔬菜与红酒汁',
        price: 888,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '7',
        title: '香煎银鳕鱼',
        description: '智利银鳕鱼，橄榄油香煎，白酒黄油酱汁，芦笋配菜',
        price: 388,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '8',
        title: '慢炖羊排',
        description: '新西兰羔羊排，红酒慢炖8小时，迷迭香土豆泥',
        price: 428,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '9',
        title: '法式烤鸭胸',
        description: '法国鸭胸低温烹饪，樱桃酱汁，焦糖洋葱',
        price: 358,
        image: 'https://images.unsplash.com/photo-1580554530778-ca36943571e2?w=800&q=80',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: '4',
    name: '甜点',
    description: '甜蜜收尾，难以忘怀',
    icon: '🍰',
    dishes: [
      {
        id: '10',
        title: '焦糖布丁',
        description: '经典法式焦糖布丁，马达加斯加香草荚',
        price: 68,
        image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '11',
        title: '巧克力熔岩蛋糕',
        description: '比利时黑巧克力，中心流心，香草冰淇淋',
        price: 88,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '12',
        title: '提拉米苏',
        description: '意大利经典甜品，马斯卡彭奶酪与咖啡的完美结合',
        price: 78,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: '5',
    name: '饮品',
    description: '精选佳酿，完美搭配',
    icon: '🍷',
    dishes: [
      {
        id: '13',
        title: '特调鸡尾酒',
        description: '主厨特调，每季更换配方，询问今日特饮',
        price: 98,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '14',
        title: '精品手冲咖啡',
        description: '埃塞俄比亚耶加雪菲，水果调性，余韵悠长',
        price: 58,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: '15',
        title: '精选红葡萄酒',
        description: '法国波尔多产区，按杯供应',
        price: 128,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
        status: 'ACTIVE',
      },
    ],
  },
];
