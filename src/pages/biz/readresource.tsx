import { history } from 'umi';

export let fromReadResource = false;

export const checkFromReadResource = () => {
  if (!fromReadResource) {
    fromReadResource =
      String(history.location.query?.from).toLocaleLowerCase() === 'read';
  }
};

export const getAddShelfScheme = (novelId: string, isCache?: boolean) => {
  return `legado://import/addToBookshelf?src=https://www.furrynovel.xyz/pixiv/novel/${novelId}${
    isCache ? '/cache' : ''
  }`;
};
