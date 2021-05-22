import axios from 'axios';
import { randomByDay } from '@/utils/util';
import favUserTagData from './../data/favUser.json';
import { IFavUser, INovelInfo, INovelProfile, IUserInfo } from '../types';

export const BASE_URL = 'https://api.linpx.linpicio.com';
//export const BASE_URL = 'http://localhost:3001';

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

export const getPixivNovel = (id: string): Promise<INovelInfo> => {
  return linpxRequest(`/pixiv/novel/${id}`);
};

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
  // 拼接结果，过滤无效结果
  return idList.map((id) => novelProfileCache[id]).filter((profile) => profile);
};

export interface ITagSet {
  [tagName: string]: number;
}

export const getPixivUser = (id: string): Promise<IUserInfo | null> => {
  // 结果出错，返回null
  return linpxRequest(`/pixiv/user/${id}`).then((res) =>
    res.error ? null : res,
  );
};

// 获取一系列用户信息
export const getPixivUserList = (idList: string[]) => {
  // 过滤无效id
  return Promise.all(idList.map((id) => getPixivUser(id))).then((res) =>
    res.filter((user) => user),
  ) as Promise<IUserInfo[]>;
};

let cacheRandomRecommendIds: string[] = [];
export const getRecommendPixivAuthors = async (): Promise<string[]> => {
  if (cacheRandomRecommendIds.length) {
    return cacheRandomRecommendIds;
  }
  return linpxRequest('/recommend/authors').then(
    (res: { [index: string]: IFavUser }) => {
      // 第一次加载的时候取随机
      cacheRandomRecommendIds = Object.values(res)
        .map((favUser) => favUser.id)
        .sort((a, b) => randomByDay(Number(a) * Number(b)) - 0.5);

      return cacheRandomRecommendIds;
    },
  );
};

export const getFavUserInfo = async (): Promise<{
  [index: string]: IFavUser;
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
export const searchUser = (
  userName: string,
  page: number = 1,
): Promise<ISearchUser> => {
  userName = encodeURIComponent(userName);
  return linpxRequest(`/pixiv/search/user/${userName}?page=${page}`);
};

export interface ISearchNovel {
  novels: INovelProfile[];
  total: number;
}

// 搜索小说
export const searchNovel = (
  novelName: string,
  page: number = 1,
): Promise<ISearchNovel> => {
  novelName = encodeURIComponent(novelName);
  return linpxRequest(`/pixiv/search/novel/${novelName}?page=${page}`);
};
