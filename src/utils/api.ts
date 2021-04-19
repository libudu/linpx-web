import axios from 'axios';

export const BASE_URL = 'https://api.linpx.linpicio.com';
//const BASE_URL = 'http://localhost:8000'

const requestCache: any = {};

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

// 小说内容
export interface INovelInfo {
  id: string;
  title: string;
  userId: string;
  userName: string;
  content: string;
  coverUrl: string;
  tags: string[];
  desc: string;
  createDate: string;
}
export const getPixivNovel = (id: string): Promise<INovelInfo> => {
  return linpxRequest(`/pixiv/novel/${id}`);
};

// 一系列小说基本信息
export interface INovelProfile {
  id: string;
  title: string;
  coverUrl: string;
  tags: string[];
  userId: string;
  userName: string;
  desc: string;
  length: number;
  createDate: string;
}

export const getPixivNovelProfiles = async (
  idList: string[],
): Promise<INovelProfile[]> => {
  if (idList.length === 0) return [];
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
let cacheRandomRecommendIds: string[] = [];
export const getRecommendPixivAuthors = async (): Promise<string[]> => {
  if (cacheRandomRecommendIds.length) {
    return cacheRandomRecommendIds;
  }
  return linpxRequest('/recommend/authors').then(
    (res: { [index: string]: string }) => {
      // 第一次加载的时候取随机
      cacheRandomRecommendIds = Object.values(res).sort(
        () => Math.random() - 0.5,
      );
      return cacheRandomRecommendIds;
    },
  );
};

// 最近小说
export const getRecentNovels = (page: number = 1): Promise<INovelProfile[]> => {
  return linpxRequest(`/pixiv/recent/novels?page=${page}`);
};
