import './global.less';

export function patchRoutes({ routes }) {
  routes[0].routes.push({
    path: '*',
    component: require('@/pages/404').default,
  });
}
