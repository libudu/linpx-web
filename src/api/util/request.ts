import { isSafeMode } from '@/utils/env';
import { IMap } from '../../types';
import { request } from 'umi';

const isHttps = window.location.protocol === 'https:';
export let BASE_URL = '';
if (isSafeMode) {
  BASE_URL = 'https://slinpxapi.linpicio.com';
} else {
  if (isHttps) {
    BASE_URL = 'https://linpxapi.linpicio.com';
  } else if (process.env.NODE_ENV == 'development' && false) {
    BASE_URL = 'http://45.76.105.135:3002';
  } else {
    BASE_URL = 'http://45.76.105.135:81';
  }
}
//export const BASE_URL = 'http://localhost:3001';

console.log('backend url', BASE_URL);

const requestCache: IMap<any> = {};

export const linpxRequest = async <T = any>(
  path: string,
  useCache = true,
  method = 'GET',
): Promise<T> => {
  const cache = requestCache[path];
  if (cache && useCache) {
    console.log('cache request:', path);
    return cache;
  }
  console.log('send request:', path);
  const res = await request(BASE_URL + path, {
    method,
  });
  requestCache[path] = res;
  return res;
};

export const reqGet = (path: string) => {
  return request(BASE_URL + path, { method: 'get' }).then((res) => res.data);
};

export const reqPost = (path: string, body: any) => {
  return request(BASE_URL + path, {
    method: 'post',
    data: body,
  });
};

export const reqDelete = (path: string) => {
  return request(BASE_URL + path, {
    method: 'delete',
  }).then((res) => res.data);
};
