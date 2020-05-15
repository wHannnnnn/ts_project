import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);
const routes: RouteConfig[] = [
  {
    path: '/',
      name: "index",
      component: () => import('@/views/index.vue'),
      redirect:'homeIndex',
      meta: { keepAlive: true },
      children: [
        {
          path: "homeIndex",
          name: "首页",
          component: () => import('@/components/home/index.vue'),
          meta: { keepAlive: true },
        },
        // {
        //   path: "navIndex",
        //   name: "分类",
        //   component: () => import('@/components/navList/index'),
        //   meta: { keepAlive: true },
        // },
        // {
        //   path: "shopIndex",
        //   name: "购物车",
        //   component: () => import('@/components/shop/index'),
        //   meta: { keepAlive: true }
        // },
        // {
        //   path: "mineIndex",
        //   name: "个人",
        //   component: () => import('@/components/mine/index'),
        // },
      ]
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
