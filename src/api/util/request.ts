import axios, { Method } from 'axios';
import { IMap } from '../../types';

const isHttps = window.location.protocol === 'https:';
export const BASE_URL =
  isHttps || process.env.NODE_ENV == 'development'
    ? 'https://linpxapi.linpicio.com'
    : 'http://45.76.105.135:81';
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
  return new Promise((resolve, reject) => {
    console.log('send request:', path);
    return axios({
      url: BASE_URL + path,
      method: method,
    }).then((res) => {
      const data = res.data;
      resolve(data);
      requestCache[path] = data;
    });
  });
};

export const reqGet = (path: string) => {
  return axios.get(BASE_URL + path).then((res) => res.data);
};

export const reqPost = (path: string, body: any) => {
  return axios({
    url: BASE_URL + path,
    method: 'POST',
    data: body,
  }).then((res) => res.data);
};

export const reqDelete = (path: string) => {
  return axios.delete(BASE_URL + path).then((res) => res.data);
};
