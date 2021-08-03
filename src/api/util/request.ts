import axios from 'axios';
import { IMap } from '../../types';

export const BASE_URL = 'http://45.76.105.135:81';
//export const BASE_URL = 'http://localhost:3001';

console.log('backend url', BASE_URL);

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
      const data = res.data;
      resolve(data);
      requestCache[path] = data;
    });
  });
};
