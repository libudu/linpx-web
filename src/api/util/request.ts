import axios, { Method } from 'axios';
import { IMap } from '../../types';

const isHttps = window.location.protocol === 'https:';
export let BASE_URL = '';
if (isHttps) {
  BASE_URL = 'https://linpxapi.linpicio.com';
} else if (process.env.NODE_ENV == 'development') {
  BASE_URL = 'http://45.76.105.135:3002';
} else {
  BASE_URL = 'http://45.76.105.135:81';
}
//export const BASE_URL = 'http://localhost:3001';

console.log('backend url', BASE_URL);

const requestCache: IMap<any> = {};

export const linpxRequest = async <T = any>(
  path: string,
  useCache = true,
  method: Method = 'GET',
): Promise<T> => {
  const cache = requestCache[path];
  if (cache && useCache) {
    console.log('cache request:', path);
    return cache;
  }
  console.log('send request:', path);
  const res = await axios({
    url: BASE_URL + path,
    method: method,
  });
  const data = res.data;
  requestCache[path] = data;
  return data;
};

export const reqGet = (path: string) => {
  return axios.get(BASE_URL + path).then((res) => res.data.data);
};

export const reqPost = (path: string, body: any) => {
  return axios({
    url: BASE_URL + path,
    method: 'POST',
    data: body,
  }).then((res) => res.data);
};

export const reqDelete = (path: string) => {
  return axios.delete(BASE_URL + path).then((res) => res.data.data);
};
