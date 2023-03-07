import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import {usePermissionStoreHook} from '@/store/modules/permission';

export const Layout = () => import('@/layout/index.vue');

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {hidden: true},
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {hidden: true}
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {hidden: true}
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {title: 'dashboard', icon: 'homepage', affix: true}
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: {hidden: true}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: {title: "user", icon: "user"},
    children: [
      {
        path: 'index',
        name: 'UserInfo',
        component: () => import('@/views/user/index.vue'),
        meta: { title: 'userInfo', icon: 'user' }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/index',
    meta: { title: 'goods', icon: 'goods' },
    children: [
      {
        path: 'index',
        name: 'GoodsInfo',
        component: () => import('@/views/goods/index.vue'),
        meta: { title: 'goodsInfo', icon: 'goods' }
      }
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: '/business/index',
    meta: { title: 'business', icon: 'business' },
    children: [
      {
        path: 'index',
        name: 'BusinessInfo',
        component: () => import('@/views/business/index.vue'),
        meta: { title: 'businessInfo', icon: 'business' }
      }
    ]
  }
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({left: 0, top: 0})
});

// 重置路由
export function resetRouter() {
  const permissionStore = usePermissionStoreHook();
  permissionStore.routes.forEach(route => {
    const name = route.name;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}

export default router;
