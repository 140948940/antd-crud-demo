import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', redirect: '/users' },
    { path: '/users', component: '@/pages/users' },
  ],
  fastRefresh: {},
  mfsu:{}
});
