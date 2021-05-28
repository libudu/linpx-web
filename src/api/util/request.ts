import axios from 'axios';
import { IMap } from '../../types';

export const BASE_URL = 'https://api.linpx.linpicio.com';
//export const BASE_URL = 'http://localhost:3001';

const requestCache: IMap<any> = {};

export const linpxRequest = async (path: string) => {
  const cache = requestCache[path];
  if (cache) {
    console.log('cache request:', path);
    return cache;
  }
  return new Promise((resolve, reject) => {
    console.log('send request:', path);
    return axios({
      url: BASE_URL + path,
      method: 'GET',
    }).then((res) => {
      resolve(res.data);
      requestCache[path] = res.data;
    });
  });
};
