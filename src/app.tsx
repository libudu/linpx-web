import './global.less';
import { isDev } from './utils/util';
import PixivUser from '@/pages/pixiv/user/[id]';
import PixivNovel from '@/pages/pixiv/novel/[id]';

import ReactGA from 'react-ga';
ReactGA.initialize('G-32PRGS7SPZ');
ReactGA.pageview(window.location.pathname + window.location.search);

// 生产环境下去除日志
if (!isDev()) {
  console.log = () => {};
}

export function patchRoutes({ routes }: any) {
  routes[0].routes.unshift(
    {
      path: '/pu/:id',
      component: PixivUser,
    },
    {
      path: '/pn/:id',
      component: PixivNovel,
    },
  );
}
