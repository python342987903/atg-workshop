
// 数据模型
const services = [
  {
    id: '1',
    title: '聚合支付二维码',
    description: '一站式聚合支付解决方案，支持微信、支付宝、银联等多种支付方式',
    price: 299,
    category: 'payment',
    features: ['支持多种支付方式', '实时到账通知', '交易数据分析', '7x24小时技术支持'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&amp;h=600&amp;fit=crop'
  },
  {
    id: '2',
    title: '视频拍摄及推广',
    description: '专业视频制作服务，包括企业宣传片、网剧拍摄、短视频推广等',
    price: 1999,
    category: 'video',
    features: ['专业拍摄团队', '后期剪辑制作', '多平台推广', '效果数据分析'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&amp;h=600&amp;fit=crop'
  },
  {
    id: '3',
    title: '修图去水印及AI创作',
    description: '专业图片处理服务，包括修图、去水印、AI图像生成等',
    price: 99,
    category: 'design',
    features: ['专业修图服务', '智能去水印', 'AI图像创作', '批量处理'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&amp;h=600&amp;fit=crop'
  },
  {
    id: '4',
    title: '网站及小程序开发',
    description: '定制化网站和小程序开发服务，满足您的数字化需求',
    price: 4999,
    category: 'development',
    features: ['响应式设计', '定制化开发', '源码交付', '一年免费维护'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&amp;h=600&amp;fit=crop'
  }
];

const botResponses = [
  '您好！欢迎咨询六安阿堂哥网络工作室，请问有什么可以帮助您的？',
  '我们提供聚合支付、视频制作、修图服务、网站开发等服务。',
  '请留下您的联系方式，我们会尽快与您取得联系。',
  '感谢您的咨询！我们的客服人员会在工作时间内回复您。'
];

// 状态管理
let state = {
  currentPage: 'home',
  user: null,
  cart: [],
  orders: [],
  messages: [],
  chatOpen: false,
  currentService: null,
  currentOrder: null
};

// 从localStorage加载数据
function loadState() {
  const savedUser = localStorage.getItem('user');
  const savedCart = localStorage.getItem('cart');
  const savedOrders = localStorage.getItem('orders');
  
  if (savedUser) state.user = JSON.parse(savedUser);
  if (savedCart) state.cart = JSON.parse(savedCart);
  if (savedOrders) state.orders = JSON.parse(savedOrders);
}

// 保存状态到localStorage
function saveState() {
  if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
  localStorage.setItem('cart', JSON.stringify(state.cart));
  localStorage.setItem('orders', JSON.stringify(state.orders));
}

// 路由导航
function navigate(page, data = null) {
  state.currentPage = page;
  if (data) {
    if (data.service) state.currentService = data.service;
    if (data.order) state.currentOrder = data.order;
  }
  render();
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 渲染导航栏
function renderNavbar() {
  return `
    &lt;nav class="gradient-bg shadow-lg sticky top-0 z-50"&gt;
      &lt;div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"&gt;
        &lt;div class="flex justify-between items-center h-16"&gt;
          &lt;div class="flex items-center cursor-pointer" onclick="navigate('home')"&gt;
            &lt;div class="w-10 h-10 gold-gradient rounded-full flex items-center justify-center"&gt;
              &lt;span class="text-white font-bold text-lg"&gt;堂&lt;/span&gt;
            &lt;/div&gt;
            &lt;span class="ml-3 text-white font-bold text-xl"&gt;六安阿堂哥网络工作室&lt;/span&gt;
          &lt;/div&gt;
          &lt;div class="flex items-center space-x-4"&gt;
            &lt;button onclick="navigate('home')" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"&gt;首页&lt;/button&gt;
            &lt;button onclick="navigate('cart')" class="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"&gt;
              购物车
              ${state.cart.length &gt; 0 ? `&lt;span class="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"&gt;${state.cart.length}&lt;/span&gt;` : ''}
            &lt;/button&gt;
            ${state.user ? `
              &lt;button onclick="navigate('orders')" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"&gt;我的订单&lt;/button&gt;
              &lt;button onclick="navigate('user')" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"&gt;${state.user.name}&lt;/button&gt;
              &lt;button onclick="logout()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"&gt;退出&lt;/button&gt;
            ` : `
              &lt;button onclick="navigate('login')" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"&gt;登录&lt;/button&gt;
              &lt;button onclick="navigate('register')" class="gold-gradient text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"&gt;注册&lt;/button&gt;
            `}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/nav&gt;
  `;
}

// 渲染首页
function renderHome() {
  return `
    &lt;div class="fade-in"&gt;
      &lt;section class="gradient-bg text-white py-20"&gt;
        &lt;div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"&gt;
          &lt;div class="float-animation"&gt;
            &lt;h1 class="text-5xl font-bold mb-6"&gt;六安阿堂哥网络工作室&lt;/h1&gt;
            &lt;p class="text-xl text-gray-300 mb-8"&gt;专业数字化服务，助力您的业务腾飞&lt;/p&gt;
            &lt;div class="flex justify-center space-x-4"&gt;
              &lt;button onclick="scrollToServices()" class="gold-gradient text-slate-900 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"&gt;了解服务&lt;/button&gt;
              &lt;button onclick="toggleChat()" class="border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 hover:text-slate-900 transition"&gt;在线咨询&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      &lt;section id="services" class="py-20 bg-white"&gt;
        &lt;div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"&gt;
          &lt;h2 class="text-4xl font-bold text-center text-slate-800 mb-4"&gt;我们的服务&lt;/h2&gt;
          &lt;p class="text-center text-gray-600 mb-12"&gt;四大核心业务，满足您的数字化需求&lt;/p&gt;
          &lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"&gt;
            ${services.map(service =&gt; `
              &lt;div class="card-hover bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100" onclick="navigate('service', {service: '${service.id}'})"&gt;
                &lt;div class="h-48 overflow-hidden"&gt;
                  &lt;img src="${service.image}" alt="${service.title}" class="w-full h-full object-cover"&gt;
                &lt;/div&gt;
                &lt;div class="p-6"&gt;
                  &lt;h3 class="text-xl font-bold text-slate-800 mb-2"&gt;${service.title}&lt;/h3&gt;
                  &lt;p class="text-gray-600 text-sm mb-4 line-clamp-2"&gt;${service.description}&lt;/p&gt;
                  &lt;div class="flex justify-between items-center"&gt;
                    &lt;span class="text-2xl font-bold text-yellow-600"&gt;¥${service.price}&lt;/span&gt;
                    &lt;button class="text-blue-600 hover:text-blue-800 font-medium"&gt;查看详情 →&lt;/button&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            `).join('')}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      &lt;section class="py-16 gradient-bg"&gt;
        &lt;div class="max-w-4xl mx-auto px-4 text-center"&gt;
          &lt;h2 class="text-3xl font-bold text-white mb-6"&gt;为什么选择我们？&lt;/h2&gt;
          &lt;div class="grid grid-cols-1 md:grid-cols-3 gap-8"&gt;
            &lt;div class="text-white"&gt;
              &lt;div class="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4"&gt;
                &lt;span class="text-2xl"&gt;⭐&lt;/span&gt;
              &lt;/div&gt;
              &lt;h3 class="text-xl font-semibold mb-2"&gt;专业团队&lt;/h3&gt;
              &lt;p class="text-gray-300"&gt;经验丰富的专业服务团队&lt;/p&gt;
            &lt;/div&gt;
            &lt;div class="text-white"&gt;
              &lt;div class="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4"&gt;
                &lt;span class="text-2xl"&gt;🚀&lt;/span&gt;
              &lt;/div&gt;
              &lt;h3 class="text-xl font-semibold mb-2"&gt;高效服务&lt;/h3&gt;
              &lt;p class="text-gray-300"&gt;快速响应，高效完成&lt;/p&gt;
            &lt;/div&gt;
            &lt;div class="text-white"&gt;
              &lt;div class="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4"&gt;
                &lt;span class="text-2xl"&gt;💎&lt;/span&gt;
              &lt;/div&gt;
              &lt;h3 class="text-xl font-semibold mb-2"&gt;品质保证&lt;/h3&gt;
              &lt;p class="text-gray-300"&gt;严格把控，品质优先&lt;/p&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/section&gt;
    &lt;/div&gt;
  `;
}

// 渲染服务详情页
function renderService() {
  const service = services.find(s =&gt; s.id === state.currentService);
  if (!service) return '&lt;div class="text-center py-20"&gt;服务不存在&lt;/div&gt;';
  
  return `
    &lt;div class="fade-in max-w-5xl mx-auto px-4 py-12"&gt;
      &lt;button onclick="navigate('home')" class="text-gray-600 hover:text-gray-800 mb-8 flex items-center"&gt;
        ← 返回首页
      &lt;/button&gt;
      &lt;div class="bg-white rounded-2xl shadow-xl overflow-hidden"&gt;
        &lt;div class="grid grid-cols-1 lg:grid-cols-2"&gt;
          &lt;div class="h-80 lg:h-auto"&gt;
            &lt;img src="${service.image}" alt="${service.title}" class="w-full h-full object-cover"&gt;
          &lt;/div&gt;
          &lt;div class="p-8 lg:p-12"&gt;
            &lt;h1 class="text-3xl font-bold text-slate-800 mb-4"&gt;${service.title}&lt;/h1&gt;
            &lt;p class="text-gray-600 mb-6"&gt;${service.description}&lt;/p&gt;
            &lt;div class="text-4xl font-bold text-yellow-600 mb-8"&gt;¥${service.price}&lt;/div&gt;
            
            &lt;h3 class="text-lg font-semibold text-slate-800 mb-4"&gt;服务特色&lt;/h3&gt;
            &lt;ul class="space-y-3 mb-8"&gt;
              ${service.features.map(feature =&gt; `
                &lt;li class="flex items-center text-gray-600"&gt;
                  &lt;span class="text-green-500 mr-3"&gt;✓&lt;/span&gt;
                  ${feature}
                &lt;/li&gt;
              `).join('')}
            &lt;/ul&gt;
            
            &lt;button onclick="addToCart('${service.id}')" class="w-full gold-gradient text-slate-900 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"&gt;
              加入购物车
            &lt;/button&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `;
}

// 渲染登录页
function renderLogin() {
  return `
    &lt;div class="fade-in min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50"&gt;
      &lt;div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"&gt;
        &lt;h2 class="text-3xl font-bold text-center text-slate-800 mb-8"&gt;登录&lt;/h2&gt;
        &lt;form onsubmit="handleLogin(event)"&gt;
          &lt;div class="mb-6"&gt;
            &lt;label class="block text-gray-700 font-medium mb-2"&gt;手机号&lt;/label&gt;
            &lt;input type="tel" id="loginPhone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="请输入手机号"&gt;
          &lt;/div&gt;
          &lt;div class="mb-6"&gt;
            &lt;label class="block text-gray-700 font-medium mb-2"&gt;密码&lt;/label&gt;
            &lt;input type="password" id="loginPassword" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="请输入密码"&gt;
          &lt;/div&gt;
          &lt;button type="submit" class="w-full gold-gradient text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition mb-4"&gt;登录&lt;/button&gt;
          &lt;p class="text-center text-gray-600"&gt;还没有账号？&lt;a href="#" onclick="navigate('register')" class="text-blue-600 hover:underline"&gt;立即注册&lt;/a&gt;&lt;/p&gt;
        &lt;/form&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `;
}

// 渲染注册页
function renderRegister() {
  return `
    &lt;div class="fade-in min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50"&gt;
      &lt;div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"&gt;
        &lt;h2 class="text-3xl font-bold text-center text-slate-800 mb-8"&gt;注册&lt;/h2&gt;
        &lt;form onsubmit="handleRegister(event)"&gt;
          &lt;div class="mb-6"&gt;
            &lt;label class="block text-gray-700 font-medium mb-2"&gt;手机号&lt;/label&gt;
            &lt;input type="tel" id="registerPhone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="请输入手机号"&gt;
          &lt;/div&gt;
          &lt;div class="mb-6"&gt;
            &lt;label class="block text-gray-700 font-medium mb-2"&gt;姓名&lt;/label&gt;
            &lt;input type="text" id="registerName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="请输入姓名"&gt;
          &lt;/div&gt;
          &lt;div class="mb-6"&gt;
            &lt;label class="block text-gray-700 font-medium mb-2"&gt;密码&lt;/label&gt;
            &lt;input type="password" id="registerPassword" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="请输入密码"&gt;
          &lt;/div&gt;
          &lt;button type="submit" class="w-full gold-gradient text-slate-900 py-3 rounded-lg font-bold hover:opacity-90 transition mb-4"&gt;注册&lt;/button&gt;
          &lt;p class="text-center text-gray-600"&gt;已有账号？&lt;a href="#" onclick="navigate('login')" class="text-blue-600 hover:underline"&gt;立即登录&lt;/a&gt;&lt;/p&gt;
        &lt;/form&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `;
}

// 渲染购物车
function renderCart() {
  const total = state.cart.reduce((sum, item) =&gt; sum + item.service.price * item.quantity, 0);
  
  return `
    &lt;div class="fade-in max-w-4xl mx-auto px-4 py-12"&gt;
      &lt;h1 class="text-3xl font-bold text-slate-800 mb-8"&gt;购物车&lt;/h1&gt;
      ${state.cart.length === 0 ? `
        &lt;div class="text-center py-20"&gt;
          &lt;p class="text-gray-500 text-xl mb-6"&gt;购物车是空的&lt;/p&gt;
          &lt;button onclick="navigate('home')" class="gold-gradient text-slate-900 px-8 py-3 rounded-lg font-semibold"&gt;去选购&lt;/button&gt;
        &lt;/div&gt;
      ` : `
        &lt;div class="space-y-4 mb-8"&gt;
          ${state.cart.map((item, index) =&gt; `
            &lt;div class="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"&gt;
              &lt;div class="flex items-center"&gt;
                &lt;img src="${item.service.image}" alt="${item.service.title}" class="w-24 h-24 object-cover rounded-lg mr-6"&gt;
                &lt;div&gt;
                  &lt;h3 class="font-bold text-slate-800"&gt;${item.service.title}&lt;/h3&gt;
                  &lt;p class="text-yellow-600 font-bold text-xl"&gt;¥${item.service.price}&lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
              &lt;div class="flex items-center space-x-4"&gt;
                &lt;div class="flex items-center space-x-2"&gt;
                  &lt;button onclick="updateQuantity(${index}, -1)" class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"&gt;-&lt;/button&gt;
                  &lt;span class="w-8 text-center"&gt;${item.quantity}&lt;/span&gt;
                  &lt;button onclick="updateQuantity(${index}, 1)" class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"&gt;+&lt;/button&gt;
                &lt;/div&gt;
                &lt;button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700"&gt;删除&lt;/button&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          `).join('')}
        &lt;/div&gt;
        &lt;div class="bg-white rounded-xl shadow-md p-6"&gt;
          &lt;div class="flex justify-between items-center mb-6"&gt;
            &lt;span class="text-xl font-semibold"&gt;总计&lt;/span&gt;
            &lt;span class="text-3xl font-bold text-yellow-600"&gt;¥${total}&lt;/span&gt;
          &lt;/div&gt;
          &lt;button onclick="navigate('checkout')" class="w-full gold-gradient text-slate-900 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"&gt;
            去结算
          &lt;/button&gt;
        &lt;/div&gt;
      `}
    &lt;/div&gt;
  `;
}

// 渲染结算页
function renderCheckout() {
  if (!state.user) {
    navigate('login');
    return '';
  }
  
  const total = state.cart.reduce((sum, item) =&gt; sum + item.service.price * item.quantity, 0);
  
  return `
    &lt;div class="fade-in max-w-4xl mx-auto px-4 py-12"&gt;
      &lt;h1 class="text-3xl font-bold text-slate-800 mb-8"&gt;确认订单&lt;/h1&gt;
      &lt;div class="grid grid-cols-1 lg:grid-cols-2 gap-8"&gt;
        &lt;div&gt;
          &lt;div class="bg-white rounded-xl shadow-md p-6 mb-6"&gt;
            &lt;h2 class="text-xl font-bold text-slate-800 mb-4"&gt;收货信息&lt;/h2&gt;
            &lt;form onsubmit="handleCheckout(event)"&gt;
              &lt;div class="mb-4"&gt;
                &lt;label class="block text-gray-700 font-medium mb-2"&gt;收货人&lt;/label&gt;
                &lt;input type="text" id="receiverName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" value="${state.user.name}"&gt;
              &lt;/div&gt;
              &lt;div class="mb-4"&gt;
                &lt;label class="block text-gray-700 font-medium mb-2"&gt;联系电话&lt;/label&gt;
                &lt;input type="tel" id="receiverPhone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" value="${state.user.phone}"&gt;
              &lt;/div&gt;
              &lt;div class="mb-4"&gt;
                &lt;label class="block text-gray-700 font-medium mb-2"&gt;收货地址&lt;/label&gt;
                &lt;textarea id="receiverAddress" required rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="请输入详细地址"&gt;&lt;/textarea&gt;
              &lt;/div&gt;
            &lt;/form&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div&gt;
          &lt;div class="bg-white rounded-xl shadow-md p-6 mb-6"&gt;
            &lt;h2 class="text-xl font-bold text-slate-800 mb-4"&gt;订单商品&lt;/h2&gt;
            &lt;div class="space-y-4 mb-4"&gt;
              ${state.cart.map(item =&gt; `
                &lt;div class="flex justify-between"&gt;
                  &lt;span&gt;${item.service.title} x ${item.quantity}&lt;/span&gt;
                  &lt;span&gt;¥${item.service.price * item.quantity}&lt;/span&gt;
                &lt;/div&gt;
              `).join('')}
            &lt;/div&gt;
            &lt;div class="border-t pt-4 flex justify-between text-xl font-bold"&gt;
              &lt;span&gt;总计&lt;/span&gt;
              &lt;span class="text-yellow-600"&gt;¥${total}&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          &lt;button onclick="handleCheckout(event)" class="w-full gold-gradient text-slate-900 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"&gt;
            提交订单
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `;
}

// 渲染支付页
function renderPayment() {
  if (!state.currentOrder) {
    navigate('orders');
    return '';
  }
  
  return `
    &lt;div class="fade-in max-w-2xl mx-auto px-4 py-12"&gt;
      &lt;h1 class="text-3xl font-bold text-slate-800 mb-8 text-center"&gt;选择支付方式&lt;/h1&gt;
      &lt;div class="bg-white rounded-2xl shadow-xl p-8"&gt;
        &lt;div class="text-center mb-8"&gt;
          &lt;p class="text-gray-600 mb-2"&gt;订单金额&lt;/p&gt;
          &lt;p class="text-4xl font-bold text-yellow-600"&gt;¥${state.currentOrder.totalPrice}&lt;/p&gt;
        &lt;/div&gt;
        
        &lt;div class="space-y-4 mb-8"&gt;
          &lt;button onclick="selectPayment('wechat')" class="w-full border-2 border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-green-500 transition payment-option" data-method="wechat"&gt;
            &lt;div class="flex items-center"&gt;
              &lt;div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4"&gt;
                &lt;span class="text-white text-2xl"&gt;💬&lt;/span&gt;
              &lt;/div&gt;
              &lt;span class="text-lg font-semibold"&gt;微信支付&lt;/span&gt;
            &lt;/div&gt;
            &lt;div class="w-6 h-6 border-2 border-gray-300 rounded-full payment-radio"&gt;&lt;/div&gt;
          &lt;/button&gt;
          
          &lt;button onclick="selectPayment('alipay')" class="w-full border-2 border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-blue-500 transition payment-option" data-method="alipay"&gt;
            &lt;div class="flex items-center"&gt;
              &lt;div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4"&gt;
                &lt;span class="text-white text-2xl"&gt;💳&lt;/span&gt;
              &lt;/div&gt;
              &lt;span class="text-lg font-semibold"&gt;支付宝&lt;/span&gt;
            &lt;/div&gt;
            &lt;div class="w-6 h-6 border-2 border-gray-300 rounded-full payment-radio"&gt;&lt;/div&gt;
          &lt;/button&gt;
        &lt;/div&gt;
        
        &lt;div id="paymentCode" class="hidden text-center mb-8"&gt;
          &lt;div class="bg-gray-100 rounded-xl p-8 inline-block"&gt;
            &lt;div class="w-48 h-48 bg-white border-2 border-gray-300 flex items-center justify-center mb-4"&gt;
              &lt;span class="text-gray-500 text-sm text-center"&gt;收款码&lt;br&gt;（扫码支付）&lt;/span&gt;
            &lt;/div&gt;
            &lt;p class="text-gray-600"&gt;请使用手机扫码支付&lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        &lt;button onclick="confirmPayment()" id="confirmPaymentBtn" disabled class="w-full bg-gray-300 text-gray-500 py-4 rounded-lg font-bold text-lg cursor-not-allowed transition"&gt;
          确认支付
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `;
}

// 渲染订单列表
function renderOrders() {
  if (!state.user) {
    navigate('login');
    return '';
  }
  
  const userOrders = state.orders.filter(o =&gt; o.userId === state.user.id);
  
  const statusText = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已签收',
    reviewed: '已评价'
  };
  
  const statusColor = {
    pending: 'text-orange-500',
    paid: 'text-blue-500',
    shipped: 'text-purple-500',
    delivered: 'text-green-500',
    reviewed: 'text-gray-500'
  };
  
  return `
    &lt;div class="fade-in max-w-4xl mx-auto px-4 py-12"&gt;
      &lt;h1 class="text-3xl font-bold text-slate-800 mb-8"&gt;我的订单&lt;/h1&gt;
      ${userOrders.length === 0 ? `
        &lt;div class="text-center py-20"&gt;
          &lt;p class="text-gray-500 text-xl mb-6"&gt;暂无订单&lt;/p&gt;
          &lt;button onclick="navigate('home')" class="gold-gradient text-slate-900 px-8 py-3 rounded-lg font-semibold"&gt;去选购&lt;/button&gt;
        &lt;/div&gt;
      ` : `
        &lt;div class="space-y-6"&gt;
          ${userOrders.map(order =&gt; `
            &lt;div class="bg-white rounded-xl shadow-md p-6"&gt;
              &lt;div class="flex justify-between items-start mb-4"&gt;
                &lt;div&gt;
                  &lt;p class="text-sm text-gray-500"&gt;订单号：${order.id}&lt;/p&gt;
                  &lt;p class="text-sm text-gray-500"&gt;${new Date(order.createdAt).toLocaleString()}&lt;/p&gt;
                &lt;/div&gt;
                &lt;span class="${statusColor[order.status]} font-semibold"&gt;${statusText[order.status]}&lt;/span&gt;
              &lt;/div&gt;
              &lt;div class="border-t pt-4 mb-4"&gt;
                ${order.items.map(item =&gt; `
                  &lt;div class="flex items-center py-2"&gt;
                    &lt;img src="${item.service.image}" alt="${item.service.title}" class="w-16 h-16 object-cover rounded mr-4"&gt;
                    &lt;div class="flex-1"&gt;
                      &lt;p class="font-medium"&gt;${item.service.title}&lt;/p&gt;
                      &lt;p class="text-gray-500 text-sm"&gt;x${item.quantity}&lt;/p&gt;
                    &lt;/div&gt;
                    &lt;p class="text-yellow-600 font-bold"&gt;¥${item.service.price * item.quantity}&lt;/p&gt;
                  &lt;/div&gt;
                `).join('')}
              &lt;/div&gt;
              &lt;div class="flex justify-between items-center pt-4 border-t"&gt;
                &lt;span class="text-gray-600"&gt;总计：&lt;span class="text-xl font-bold text-yellow-600"&gt;¥${order.totalPrice}&lt;/span&gt;&lt;/span&gt;
                &lt;div class="space-x-2"&gt;
                  ${order.status === 'pending' ? `
                    &lt;button onclick="payOrder('${order.id}')" class="gold-gradient text-slate-900 px-4 py-2 rounded-lg font-medium"&gt;去支付&lt;/button&gt;
                  ` : ''}
                  ${order.status === 'delivered' ? `
                    &lt;button onclick="navigate('order', {order: '${order.id}'})" class="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"&gt;评价&lt;/button&gt;
                  ` : ''}
                  &lt;button onclick="navigate('order', {order: '${order.id}'})" class="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium"&gt;查看详情&lt;/button&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          `).join('')}
        &lt;/div&gt;
      `}
    &lt;/div&gt;
  `;
}

// 渲染订单详情
function renderOrderDetail() {
  const order = state.orders.find(o =&gt; o.id === state.currentOrder);
  if (!order) {
    navigate('orders');
    return '';
  }
  
  const statusText = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已签收',
    reviewed: '已评价'
  };
  
  return `
    &lt;div class="fade-in max-w-4xl mx-auto px-4 py-12"&gt;
      &lt;button onclick="navigate('orders')" class="text-gray-600 hover:text-gray-800 mb-8 flex items-center"&gt;
        ← 返回订单列表
      &lt;/button&gt;
      &lt;div class="bg-white rounded-2xl shadow-xl p-8"&gt;
        &lt;h1 class="text-2xl font-bold text-slate-800 mb-6"&gt;订单详情&lt;/h1&gt;
        
        &lt;div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"&gt;
          &lt;div&gt;
            &lt;h3 class="font-semibold text-slate-800 mb-4"&gt;订单信息&lt;/h3&gt;
            &lt;p class="text-gray-600 mb-2"&gt;订单号：${order.id}&lt;/p&gt;
            &lt;p class="text-gray-600 mb-2"&gt;状态：&lt;span class="text-green-600 font-medium"&gt;${statusText[order.status]}&lt;/span&gt;&lt;/p&gt;
            &lt;p class="text-gray-600"&gt;下单时间：${new Date(order.createdAt).toLocaleString()}&lt;/p&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;h3 class="font-semibold text-slate-800 mb-4"&gt;收货信息&lt;/h3&gt;
            &lt;p class="text-gray-600 mb-2"&gt;收货人：${order.address.split('|')[0]}&lt;/p&gt;
            &lt;p class="text-gray-600 mb-2"&gt;电话：${order.phone}&lt;/p&gt;
            &lt;p class="text-gray-600"&gt;地址：${order.address.split('|')[1] || order.address}&lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        ${order.trackingNumber ? `
          &lt;div class="bg-blue-50 rounded-xl p-6 mb-8"&gt;
            &lt;h3 class="font-semibold text-blue-800 mb-4"&gt;物流信息&lt;/h3&gt;
            &lt;p class="text-blue-600"&gt;快递单号：${order.trackingNumber}&lt;/p&gt;
            &lt;p class="text-blue-600 text-sm mt-2"&gt;（物流查询功能演示）&lt;/p&gt;
          &lt;/div&gt;
        ` : ''}
        
        &lt;div class="border-t pt-6 mb-6"&gt;
          &lt;h3 class="font-semibold text-slate-800 mb-4"&gt;商品清单&lt;/h3&gt;
          ${order.items.map(item =&gt; `
            &lt;div class="flex items-center py-3 border-b"&gt;
              &lt;img src="${item.service.image}" alt="${item.service.title}" class="w-20 h-20 object-cover rounded mr-4"&gt;
              &lt;div class="flex-1"&gt;
                &lt;p class="font-medium"&gt;${item.service.title}&lt;/p&gt;
                &lt;p class="text-gray-500 text-sm"&gt;x${item.quantity}&lt;/p&gt;
              &lt;/div&gt;
              &lt;p class="text-yellow-600 font-bold text-xl"&gt;¥${item.service.price * item.quantity}&lt;/p&gt;
            &lt;/div&gt;
          `).join('')}
          &lt;div class="flex justify-end mt-4"&gt;
            &lt;span class="text-xl font-semibold"&gt;总计：&lt;span class="text-yellow-600 text-2xl font-bold"&gt;¥${order.totalPrice}&lt;/span&gt;&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        ${order.status === 'delivered' &amp;&amp; !order.review ? `
          &lt;div class="border-t pt-6"&gt;
            &lt;h3 class="font-semibold text-slate-800 mb-4"&gt;发表评价&lt;/h3&gt;
            &lt;div class="mb-4"&gt;
              &lt;label class="block text-gray-700 mb-2"&gt;评分&lt;/label&gt;
              &lt;div class="flex space-x-2" id="ratingStars"&gt;
                ${[1,2,3,4,5].map(i =&gt; `&lt;button onclick="setRating(${i})" class="text-3xl text-gray-300 hover:text-yellow-500 rating-star" data-rating="${i}"&gt;★&lt;/button&gt;`).join('')}
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="mb-4"&gt;
              &lt;textarea id="reviewText" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="请输入评价内容..."&gt;&lt;/textarea&gt;
            &lt;/div&gt;
            &lt;button onclick="submitReview('${order.id}')" class="gold-gradient text-slate-900 px-8 py-3 rounded-lg font-bold"&gt;提交评价&lt;/button&gt;
          &lt;/div&gt;
        ` : ''}
        
        ${order.review ? `
          &lt;div class="border-t pt-6"&gt;
            &lt;h3 class="font-semibold text-slate-800 mb-4"&gt;我的评价&lt;/h3&gt;
            &lt;div class="bg-gray-50 rounded-xl p-6"&gt;
              &lt;div class="text-yellow-500 text-xl mb-2"&gt;${'★'.repeat(order.rating)}${'☆'.repeat(5 - order.rating)}&lt;/div&gt;
              &lt;p class="text-gray-600"&gt;${order.review}&lt;/p&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        ` : ''}
      &lt;/div&gt;
    &lt;/div&gt;
  `;
}

// 渲染用户中心
function renderUser() {
  if (!state.user) {
    navigate('login');
    return '';
  }
  
  return `
    &lt;div class="fade-in max-w-4xl mx-auto px-4 py-12"&gt;
      &lt;h1 class="text-3xl font-bold text-slate-800 mb-8"&gt;个人中心&lt;/h1&gt;
      &lt;div class="bg-white rounded-2xl shadow-xl p-8"&gt;
        &lt;div class="flex items-center mb-8"&gt;
          &lt;div class="w-24 h-24 gold-gradient rounded-full flex items-center justify-center mr-6"&gt;
            &lt;span class="text-white text-4xl font-bold"&gt;${state.user.name.charAt(0)}&lt;/span&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;h2 class="text-2xl font-bold text-slate-800"&gt;${state.user.name}&lt;/h2&gt;
            &lt;p class="text-gray-600"&gt;手机号：${state.user.phone}&lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        &lt;div class="grid grid-cols-1 md:grid-cols-3 gap-6"&gt;
          &lt;button onclick="navigate('orders')" class="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-500 transition"&gt;
            &lt;div class="text-3xl mb-2"&gt;📦&lt;/div&gt;
            &lt;h3 class="font-semibold text-slate-800"&gt;我的订单&lt;/h3&gt;
            &lt;p class="text-gray-500 text-sm"&gt;查看订单状态&lt;/p&gt;
          &lt;/button&gt;
          &lt;button onclick="navigate('cart')" class="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-500 transition"&gt;
            &lt;div class="text-3xl mb-2"&gt;🛒&lt;/div&gt;
            &lt;h3 class="font-semibold text-slate-800"&gt;购物车&lt;/h3&gt;
            &lt;p class="text-gray-500 text-sm"&gt;查看购物车&lt;/p&gt;
          &lt;/button&gt;
          &lt;button onclick="logout()" class="text-left p-6 border-2 border-red-200 rounded-xl hover:border-red-500 transition"&gt;
            &lt;div class="text-3xl mb-2"&gt;🚪&lt;/div&gt;
            &lt;h3 class="font-semibold text-red-600"&gt;退出登录&lt;/h3&gt;
            &lt;p class="text-gray-500 text-sm"&gt;安全退出&lt;/p&gt;
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `;
}

// 渲染在线客服
function renderChat() {
  return `
    &lt;div id="chatWidget" class="fixed bottom-6 right-6 z-50"&gt;
      &lt;button onclick="toggleChat()" class="w-16 h-16 gold-gradient rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition"&gt;
        &lt;span class="text-3xl"&gt;💬&lt;/span&gt;
      &lt;/button&gt;
      
      ${state.chatOpen ? `
        &lt;div class="absolute bottom-20 right-0 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden chat-bubble"&gt;
          &lt;div class="gradient-bg text-white p-4"&gt;
            &lt;div class="flex justify-between items-center"&gt;
              &lt;div class="flex items-center"&gt;
                &lt;div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3"&gt;
                  &lt;span class="text-white"&gt;🤖&lt;/span&gt;
                &lt;/div&gt;
                &lt;div&gt;
                  &lt;h3 class="font-semibold"&gt;在线客服&lt;/h3&gt;
                  &lt;p class="text-xs text-gray-300"&gt;QQ机器人在线&lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
              &lt;button onclick="toggleChat()" class="text-white hover:text-gray-300"&gt;✕&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          
          &lt;div id="chatMessages" class="h-80 overflow-y-auto p-4 bg-gray-50"&gt;
            ${state.messages.length === 0 ? `
              &lt;div class="text-center text-gray-500 py-8"&gt;
                &lt;p class="text-4xl mb-2"&gt;👋&lt;/p&gt;
                &lt;p&gt;您好，请问有什么可以帮助您的？&lt;/p&gt;
              &lt;/div&gt;
            ` : state.messages.map(msg =&gt; `
              &lt;div class="mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}"&gt;
                &lt;div class="inline-block max-w-xs ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white'} px-4 py-2 rounded-2xl shadow ${msg.type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}"&gt;
                  ${msg.content}
                &lt;/div&gt;
                &lt;p class="text-xs text-gray-400 mt-1"&gt;${new Date(msg.timestamp).toLocaleTimeString()}&lt;/p&gt;
              &lt;/div&gt;
            `).join('')}
          &lt;/div&gt;
          
          &lt;div class="p-4 border-t"&gt;
            &lt;form onsubmit="sendMessage(event)" class="flex space-x-2"&gt;
              &lt;input type="text" id="chatInput" class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-500" placeholder="输入消息..."&gt;
              &lt;button type="submit" class="gold-gradient text-slate-900 px-6 py-2 rounded-full font-semibold hover:opacity-90"&gt;发送&lt;/button&gt;
            &lt;/form&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      ` : ''}
    &lt;/div&gt;
  `;
}

// 主渲染函数
function render() {
  let pageContent = '';
  
  switch(state.currentPage) {
    case 'home':
      pageContent = renderHome();
      break;
    case 'service':
      pageContent = renderService();
      break;
    case 'login':
      pageContent = renderLogin();
      break;
    case 'register':
      pageContent = renderRegister();
      break;
    case 'cart':
      pageContent = renderCart();
      break;
    case 'checkout':
      pageContent = renderCheckout();
      break;
    case 'payment':
      pageContent = renderPayment();
      break;
    case 'orders':
      pageContent = renderOrders();
      break;
    case 'order':
      pageContent = renderOrderDetail();
      break;
    case 'user':
      pageContent = renderUser();
      break;
    default:
      pageContent = renderHome();
  }
  
  document.getElementById('app').innerHTML = `
    ${renderNavbar()}
    &lt;main&gt;${pageContent}&lt;/main&gt;
    ${renderChat()}
  `;
  
  if (state.chatOpen &amp;&amp; state.messages.length &gt; 0) {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

// 添加到购物车
function addToCart(serviceId) {
  const service = services.find(s =&gt; s.id === serviceId);
  if (!service) return;
  
  const existingItem = state.cart.find(item =&gt; item.service.id === serviceId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    state.cart.push({ service, quantity: 1 });
  }
  
  saveState();
  alert('已添加到购物车！');
  navigate('cart');
}

// 更新数量
function updateQuantity(index, delta) {
  state.cart[index].quantity += delta;
  if (state.cart[index].quantity &lt; 1) {
    state.cart[index].quantity = 1;
  }
  saveState();
  render();
}

// 从购物车删除
function removeFromCart(index) {
  state.cart.splice(index, 1);
  saveState();
  render();
}

// 登录处理
function handleLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('loginPhone').value;
  const password = document.getElementById('loginPassword').value;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u =&gt; u.phone === phone);
  
  if (user) {
    state.user = user;
    saveState();
    alert('登录成功！');
    navigate('home');
  } else {
    alert('用户不存在，请先注册！');
  }
}

// 注册处理
function handleRegister(e) {
  e.preventDefault();
  const phone = document.getElementById('registerPhone').value;
  const name = document.getElementById('registerName').value;
  const password = document.getElementById('registerPassword').value;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find(u =&gt; u.phone === phone)) {
    alert('该手机号已注册！');
    return;
  }
  
  const newUser = {
    id: generateId(),
    phone,
    name
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  state.user = newUser;
  saveState();
  alert('注册成功！');
  navigate('home');
}

// 退出登录
function logout() {
  state.user = null;
  localStorage.removeItem('user');
  navigate('home');
}

// 结算处理
function handleCheckout(e) {
  e.preventDefault();
  
  const name = document.getElementById('receiverName').value;
  const phone = document.getElementById('receiverPhone').value;
  const address = document.getElementById('receiverAddress').value;
  
  if (!name || !phone || !address) {
    alert('请填写完整的收货信息！');
    return;
  }
  
  const total = state.cart.reduce((sum, item) =&gt; sum + item.service.price * item.quantity, 0);
  
  const order = {
    id: generateId(),
    userId: state.user.id,
    items: [...state.cart],
    totalPrice: total,
    status: 'pending',
    address: `${name}|${address}`,
    phone: phone,
    createdAt: new Date().toISOString()
  };
  
  state.orders.push(order);
  state.currentOrder = order;
  state.cart = [];
  saveState();
  
  navigate('payment');
}

// 选择支付方式
let selectedPayment = null;
function selectPayment(method) {
  selectedPayment = method;
  
  document.querySelectorAll('.payment-option').forEach(el =&gt; {
    el.classList.remove('border-green-500', 'border-blue-500');
  });
  
  document.querySelectorAll('.payment-radio').forEach(el =&gt; {
    el.innerHTML = '';
    el.classList.remove('bg-green-500', 'bg-blue-500', 'border-transparent');
  });
  
  const selectedEl = document.querySelector(`[data-method="${method}"]`);
  selectedEl.classList.add(method === 'wechat' ? 'border-green-500' : 'border-blue-500');
  
  const radio = selectedEl.querySelector('.payment-radio');
  radio.innerHTML = '✓';
  radio.classList.add(method === 'wechat' ? 'bg-green-500' : 'bg-blue-500', 'text-white', 'border-transparent');
  
  document.getElementById('paymentCode').classList.remove('hidden');
  document.getElementById('confirmPaymentBtn').disabled = false;
  document.getElementById('confirmPaymentBtn').classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
  document.getElementById('confirmPaymentBtn').classList.add('gold-gradient', 'text-slate-900', 'hover:opacity-90', 'cursor-pointer');
}

// 确认支付
function confirmPayment() {
  if (!selectedPayment) {
    alert('请选择支付方式！');
    return;
  }
  
  const order = state.orders.find(o =&gt; o.id === state.currentOrder.id);
  if (order) {
    order.status = 'paid';
    order.paymentMethod = selectedPayment;
    order.trackingNumber = 'SF' + Math.random().toString(36).substr(2, 10).toUpperCase();
    
    setTimeout(() =&gt; {
      const o = state.orders.find(or =&gt; or.id === order.id);
      if (o &amp;&amp; o.status === 'paid') {
        o.status = 'shipped';
        saveState();
      }
    }, 5000);
    
    setTimeout(() =&gt; {
      const o = state.orders.find(or =&gt; or.id === order.id);
      if (o &amp;&amp; o.status === 'shipped') {
        o.status = 'delivered';
        saveState();
      }
    }, 10000);
  }
  
  saveState();
  alert('支付成功！');
  navigate('orders');
}

// 支付订单
function payOrder(orderId) {
  const order = state.orders.find(o =&gt; o.id === orderId);
  if (order) {
    state.currentOrder = order;
    navigate('payment');
  }
}

// 设置评分
let currentRating = 0;
function setRating(rating) {
  currentRating = rating;
  document.querySelectorAll('.rating-star').forEach((el, i) =&gt; {
    if (i &lt; rating) {
      el.classList.remove('text-gray-300');
      el.classList.add('text-yellow-500');
    } else {
      el.classList.remove('text-yellow-500');
      el.classList.add('text-gray-300');
    }
  });
}

// 提交评价
function submitReview(orderId) {
  const reviewText = document.getElementById('reviewText').value;
  
  if (!currentRating) {
    alert('请选择评分！');
    return;
  }
  
  if (!reviewText) {
    alert('请输入评价内容！');
    return;
  }
  
  const order = state.orders.find(o =&gt; o.id === orderId);
  if (order) {
    order.review = reviewText;
    order.rating = currentRating;
    order.status = 'reviewed';
    saveState();
    alert('评价提交成功！');
    render();
  }
}

// 切换聊天
function toggleChat() {
  state.chatOpen = !state.chatOpen;
  render();
}

// 发送消息
function sendMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const content = input.value.trim();
  
  if (!content) return;
  
  state.messages.push({
    id: generateId(),
    content,
    type: 'user',
    timestamp: new Date().toISOString()
  });
  
  render();
  input.value = '';
  
  setTimeout(() =&gt; {
    const botMsg = botResponses[Math.floor(Math.random() * botResponses.length)];
    state.messages.push({
      id: generateId(),
      content: botMsg,
      type: 'bot',
      timestamp: new Date().toISOString()
    });
    render();
  }, 1000);
}

// 滚动到服务
function scrollToServices() {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// 初始化
loadState();
render();
