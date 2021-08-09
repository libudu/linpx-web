import { BASE_URL } from '@/api/util/request';

const chineseTrans = require('chinese-s2t');
export const { t2s }: { t2s: (text: string) => string } = chineseTrans;

export function getAppWidth() {
  return Math.min(448, document.documentElement.clientWidth);
}

const day = Math.ceil(new Date().getTime() / 1000 / 60 / 60 / 24 + 0.333333);
export function randomByDay(seed: number) {
  return ((seed * day + 49297) % 233280) / 233280;
}

export const list2query = (itemList: string[], keyName = 'ids') => {
  return itemList.map((item) => `${keyName}[]=${item}`).join('&');
};

export function proxyImg(url: string | undefined) {
  if (url && !url.startsWith(BASE_URL)) {
    url = `${BASE_URL}/proxy/pximg?url=${url}`;
  }
  return url || '';
}

export function isDev() {
  return process.env.NODE_ENV === 'development';
}

export function stringHash(str: string) {
  let hash = 5381,
    i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  hash = hash >>> 0;
  let result = '';
  while (hash) {
    const j = hash % 52;
    hash = Math.floor(hash / 52);
    result += String.fromCharCode(65 + (j < 26 ? j : j + 6));
  }
  return result;
}
