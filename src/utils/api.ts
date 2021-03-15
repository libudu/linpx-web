import axios from 'axios';

export const BASE_URL = 'https://api.linpx.linpicio.com';
//const BASE_URL = 'http://localhost:8000'

const requestCache: any = {};

export const linpxRequest = async (path: string) => {
  const cache = requestCache[path];
  if (cache) {
    return cache;
  }
  return new Promise((resolve, reject) => {
    return axios({
      url: BASE_URL + path,
      method: 'GET',
    }).then((res) => {
      resolve(res.data);
      requestCache[path] = res.data;
    });
  });
};

// 小说内容
export interface INovelInfo {
  id: string;
  title: string;
  userId: string;
  userName: string;
  content: string;
  coverUrl: string;
  tags: string[];
}
export const getPixivNovel = (id: string): Promise<INovelInfo> => {
  return linpxRequest(`/pixiv/novel/${id}`);
};

// 一系列小说基本信息
export const getPixivNovelProfiles = (idList: string[]) => {
  let query = '';
  for (const id of idList) {
    query += `ids[]=${id}&`;
  }
  return linpxRequest(`/pixiv/novels?${query}`);
};

// 用户信息
export interface IUserInfo {
  id: string;
  novels: string[];
  name: string;
  imageUrl: string;
  comment: string;
  backgroundUrl?: string;
}
export const getPixivUser = (id: string): Promise<IUserInfo> => {
  return linpxRequest(`/pixiv/user/${id}`);
};

// 获取一系列用户信息
export const getPixivUserList = (idList: string[]) => {
  return Promise.all(idList.map((id) => getPixivUser(id)));
};

// 推荐作者列表
export const getRecommendPixivAuthors = async (): Promise<string[]> => {
  return linpxRequest('/recommend/authors').then(
    (res: { [index: string]: string }) => {
      return Object.values(res).sort(() => Math.random() - 0.5);
    },
  );
};
