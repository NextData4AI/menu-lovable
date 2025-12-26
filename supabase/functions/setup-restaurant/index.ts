import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Check if a restaurant already exists
    const { data: existingRestaurants } = await supabaseClient
      .from('restaurants')
      .select('id')
      .limit(1)

    if (existingRestaurants && existingRestaurants.length > 0) {
      // Check if user already has a role
      const { data: existingRole } = await supabaseClient
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .eq('restaurant_id', existingRestaurants[0].id)
        .maybeSingle()

      if (existingRole) {
        return new Response(
          JSON.stringify({ message: '您已经是管理员', restaurant_id: existingRestaurants[0].id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Add user as super admin to existing restaurant
      await supabaseClient
        .from('user_roles')
        .insert({
          user_id: user.id,
          restaurant_id: existingRestaurants[0].id,
          role: 'super'
        })

      return new Response(
        JSON.stringify({ message: '已将您设为超级管理员', restaurant_id: existingRestaurants[0].id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create default restaurant
    const { data: restaurant, error: restaurantError } = await supabaseClient
      .from('restaurants')
      .insert({
        name: '御膳坊',
        description: '传承百年烹饪技艺，以新鲜食材和精湛厨艺，为您呈现地道中华美食。每一道菜品都承载着对美食的热爱与对传统的敬意。',
        banner_image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
        address: '北京市朝阳区建国路88号',
        phone: '010-88888888',
        business_hours: '11:00 - 22:00'
      })
      .select()
      .single()

    if (restaurantError) throw restaurantError

    // Create user as super admin
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: user.id,
        restaurant_id: restaurant.id,
        role: 'super'
      })

    if (roleError) throw roleError

    // Create categories
    const categoriesData = [
      { restaurant_id: restaurant.id, name: '开胃菜', description: '精选开胃小菜，唤醒您的味蕾', icon: '🥗', sort_order: 0 },
      { restaurant_id: restaurant.id, name: '招牌热菜', description: '主厨精心烹制的招牌佳肴', icon: '🍲', sort_order: 1 },
      { restaurant_id: restaurant.id, name: '海鲜珍品', description: '新鲜海产，鲜美可口', icon: '🦐', sort_order: 2 },
      { restaurant_id: restaurant.id, name: '精致点心', description: '传统工艺，匠心制作', icon: '🥟', sort_order: 3 },
      { restaurant_id: restaurant.id, name: '甜品饮品', description: '饭后甜点，完美收尾', icon: '🍰', sort_order: 4 },
    ]

    const { data: categories, error: categoriesError } = await supabaseClient
      .from('categories')
      .insert(categoriesData)
      .select()

    if (categoriesError) throw categoriesError

    // Create dishes
    const dishesData = [
      // 开胃菜
      { category_id: categories[0].id, title: '凉拌黄瓜', description: '新鲜黄瓜配以秘制酱料，清爽开胃', price: 18, image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80', status: 'active', sort_order: 0 },
      { category_id: categories[0].id, title: '老醋花生', description: '香脆花生配陈年老醋，酸甜可口', price: 22, image: 'https://images.unsplash.com/photo-1599909533143-42a0c3bd0a41?w=800&q=80', status: 'active', sort_order: 1 },
      { category_id: categories[0].id, title: '皮蛋豆腐', description: '嫩滑豆腐配松花皮蛋，经典搭配', price: 28, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', status: 'active', sort_order: 2 },
      
      // 招牌热菜
      { category_id: categories[1].id, title: '宫保鸡丁', description: '选用鸡腿肉，配以花生米、干辣椒，麻辣鲜香', price: 48, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80', status: 'active', sort_order: 0 },
      { category_id: categories[1].id, title: '糖醋里脊', description: '外酥里嫩，酸甜适口，老少皆宜', price: 52, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', status: 'active', sort_order: 1 },
      { category_id: categories[1].id, title: '红烧狮子头', description: '传统淮扬名菜，肉质鲜嫩，汤汁浓郁', price: 58, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', status: 'active', sort_order: 2 },
      { category_id: categories[1].id, title: '麻婆豆腐', description: '川菜经典，麻辣鲜香，豆腐嫩滑', price: 38, image: 'https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=800&q=80', status: 'active', sort_order: 3 },
      
      // 海鲜珍品
      { category_id: categories[2].id, title: '清蒸鲈鱼', description: '新鲜鲈鱼，清蒸保留原味，肉质细嫩', price: 88, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', status: 'active', sort_order: 0 },
      { category_id: categories[2].id, title: '蒜蓉粉丝蒸扇贝', description: '鲜嫩扇贝配蒜蓉粉丝，鲜美无比', price: 68, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80', status: 'active', sort_order: 1 },
      { category_id: categories[2].id, title: '椒盐皮皮虾', description: '酥脆外壳，鲜嫩虾肉，椒盐提香', price: 98, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80', status: 'active', sort_order: 2 },
      
      // 精致点心
      { category_id: categories[3].id, title: '小笼包', description: '皮薄馅嫩，汤汁鲜美，一口一个', price: 32, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80', status: 'active', sort_order: 0 },
      { category_id: categories[3].id, title: '虾饺皇', description: '晶莹剔透，虾肉Q弹，港式经典', price: 38, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', status: 'active', sort_order: 1 },
      { category_id: categories[3].id, title: '叉烧酥', description: '层层酥皮，蜜汁叉烧，香甜可口', price: 28, image: 'https://images.unsplash.com/photo-1518983498539-e20d7f8df57b?w=800&q=80', status: 'active', sort_order: 2 },
      
      // 甜品饮品
      { category_id: categories[4].id, title: '杨枝甘露', description: '芒果西柚配椰奶西米，清甜解腻', price: 28, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80', status: 'active', sort_order: 0 },
      { category_id: categories[4].id, title: '双皮奶', description: '顺德传统甜品，奶香浓郁，入口即化', price: 22, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80', status: 'active', sort_order: 1 },
      { category_id: categories[4].id, title: '冰镇酸梅汤', description: '自制酸梅汤，酸甜开胃，消暑解渴', price: 18, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80', status: 'active', sort_order: 2 },
    ]

    const { error: dishesError } = await supabaseClient
      .from('dishes')
      .insert(dishesData)

    if (dishesError) throw dishesError

    return new Response(
      JSON.stringify({ 
        message: '初始化成功！已创建餐厅、示例数据，并将您设为超级管理员',
        restaurant_id: restaurant.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
