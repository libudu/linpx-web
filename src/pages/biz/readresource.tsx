import { registerAppInterceptor } from '@/layouts';
import { history } from 'umi';

export let fromReadResource = false;

const checkFromReadResource = () => {
  if (!fromReadResource) {
    fromReadResource =
      String(history.location.query?.from).toLocaleLowerCase() === 'read';
  }
};

export const getAddShelfScheme = (novelId: string) => {
  return `legado://import/addToBookshelf?src=https://www.furrynovel.xyz/pixiv/novel/${novelId}`;
};

registerAppInterceptor({
  check: () => true,
  render: (refresh, children) => {
    checkFromReadResource();
    return children;
  },
});
