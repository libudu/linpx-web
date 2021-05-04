import axios from 'axios';

export const BASE_URL = 'https://api.linpx.linpicio.com';
//const BASE_URL = 'http://localhost:8000'

const requestCache: any = {};

import favUserTagData from './../data/favUser.json';

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

const novelProfileCache: { [novelId: string]: INovelProfile } = {};

export const getPixivNovelProfiles = async (
  idList: string[],
): Promise<INovelProfile[]> => {
  if (idList.length === 0) return [];
  let query = '';
  for (const id of idList) {
    // 缓冲中没有则构造请求
    if (!novelProfileCache[id]) query += `ids[]=${id}&`;
  }
  // 发起请求
  if (query) {
    const leftNovelProfileList: INovelProfile[] = await linpxRequest(
      `/pixiv/novels?${query}`,
    );
    // 缓存请求结果，过滤无效结果
    leftNovelProfileList.forEach(
      (novelProfile) =>
        novelProfile && (novelProfileCache[novelProfile.id] = novelProfile),
    );
  }
  // 拼接结果
  return idList.map((id) => novelProfileCache[id]);
};

export interface ITagSet {
  [tagName: string]: number;
}

// 用户信息
export interface IUserInfo {
  id: string;
  novels: string[];
  name: string;
  imageUrl: string;
  comment: string;
  backgroundUrl?: string;
  tags: ITagSet;
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

export const getFavUserInfo = async (): Promise<{
  [index: string]: string;
}> => {
  return await linpxRequest('/recommend/authors');
};

// 最近小说
export const getRecentNovels = async (
  page: number = 1,
): Promise<INovelProfile[]> => {
  const recentNovelProfileList: INovelProfile[] = await linpxRequest(
    `/pixiv/novels/recent?page=${page}`,
  );
  // 记录到缓存
  recentNovelProfileList.forEach(
    (novelProfile) => (novelProfileCache[novelProfile.id] = novelProfile),
  );
  return recentNovelProfileList;
};

// 用户tag的全部小说
export const getUserTagNovels = (userId: string, tagName: string) => {
  return linpxRequest(`/pixiv/user/${userId}/tag/${tagName}`);
};

interface IFavUserTagInfo {
  time: string;
  localTime: string;
  user: string[];
  data: {
    tagName: string;
    time: number;
    novels: string[];
  }[];
}
export const getFavUserTagInfo = (): IFavUserTagInfo => favUserTagData;

export interface ISearchUser {
  users: {
    id: string;
    name: string;
    imageUrl: string;
    comment: string;
    novels: INovelProfile[];
  }[];
  total: number;
}

// 搜索用户
export const searchUser = (userName: string): Promise<ISearchUser> => {
  userName = encodeURIComponent(userName);
  return linpxRequest(`/pixiv/search/user/${userName}`);
};

export interface ISearchNovel {
  novels: INovelProfile[];
  total: number;
}

// 搜索小说
export const searchNovel = (novelName: string): Promise<ISearchNovel> => {
  novelName = encodeURIComponent(novelName);
  return linpxRequest(`/pixiv/search/novel/${novelName}`);
};
