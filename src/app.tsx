import './global.less';

export function patchRoutes({ routes }: any) {
  routes[0].routes = routes[0].routes.concat(
    {
      path: '/pu/:id',
      redirect: '/pixiv/user/:id',
    },
    {
      path: '/pn/:id',
      redirect: '/pixiv/novel/:id',
    },
    {
      path: '*',
      component: require('@/pages/404').default,
    },
  );
}
