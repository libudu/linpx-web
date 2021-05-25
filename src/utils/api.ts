import axios from 'axios';
import { list2query, randomByDay } from '@/utils/util';
import {
  IFavUser,
  INovelInfo,
  INovelProfile,
  IUserInfo,
  IAnalyseTag,
  IMap,
} from '../types';
import useSWR from 'swr';

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

export const usePixivNovel = (id: string) => {
  return useSWR<INovelInfo>(`/pixiv/novel/${id}`).data;
};

const novelProfileCache: { [novelId: string]: INovelProfile } = {};

// export const getPixivNovelProfiles = async (
//   idList: string[],
// ): Promise<INovelProfile[]> => {
//   if (idList.length === 0) return [];
//   const query = list2query(idList);
//   // 发起请求
//   if (query) {
//     const leftNovelProfileList: INovelProfile[] = await linpxRequest(
//       `/pixiv/novels?${query}`,
//     );
//     // 缓存请求结果，过滤无效结果
//     leftNovelProfileList.forEach(
//       (novelProfile) =>
//         novelProfile && (novelProfileCache[novelProfile.id] = novelProfile),
//     );
//   }
//   // 拼接结果，过滤无效结果
//   return idList.map((id) => novelProfileCache[id]).filter((profile) => profile);
// };

// todo: 缓存
export const usePixivNovelProfiles = (idList: string[]) => {
  const { data } = useSWR<INovelProfile[]>(
    idList.length === 0 ? null : `/pixiv/novels?${list2query(idList)}`,
  );
  return data || [];
};

export const getPixivUser = (id: string): Promise<IUserInfo | null> => {
  // 结果出错，返回null
  return linpxRequest(`/pixiv/user/${id}`).then((res) => {
    if (res.error) return null;
    if (res.tags instanceof Array) {
      const tags: any = {};
      res.tags.forEach((tag: any) => (tags[tag.tag] = tag.time));
      res.tags = tags;
    }
    return res;
  });
};

export const usePixivUser = (id: string) => {
  const { data } = useSWR<IUserInfo>(`/pixiv/user/${id}`);
  // @ts-ignore
  if (!data || data?.error) return undefined;
  if (data.tags instanceof Array) {
    console.log('user tags array to object!');
    const tags: any = {};
    data.tags.forEach((tag: any) => (tags[tag.tag] = tag.time));
    data.tags = tags;
  }
  return data;
};

export const usePixivUserList = (idList: string[]) => {
  const { data } = useSWR<IUserInfo[]>(
    idList.length === 0 ? null : `/pixiv/users?${list2query(idList)}`,
  );
  return data || [];
};

export const useFavUserIds = () => {
  const { data } = useSWR<IFavUser[]>('/fav/user');
  console.log('get fav user ids');
  if (!data) return [];
  return data
    .map((favUser) => favUser.id)
    .sort((a, b) => randomByDay(Number(a) * Number(b)) - 0.5);
};

export const useFavUser = () => {
  const { data } = useSWR<IFavUser[]>('/fav/user');
  return data || [];
};

export const useSearchFavUser = (word: string) => {
  const { data } = useSWR<IMap<IFavUser>>('/fav/user');
  if (!data) return [];
  const idList = Object.values(data)
    .filter(({ name }) => name.includes(word))
    .map(({ id }) => id);
  return idList;
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

export const usePixivRecentNovels = (page: number = 1) => {
  const { data } = useSWR<INovelProfile[]>(`/pixiv/novels/recent?page=${page}`);
  return data || [];
};

export const useUserTagNovels = (userId: string, tagName: string) => {
  const { data } = useSWR<INovelProfile[]>(
    `/pixiv/user/${userId}/tag/${tagName}`,
  );
  return data || [];
};

export const useAnalyseTag = () => {
  const { data } = useSWR<IAnalyseTag>('/analyse/tags');
  return data;
};

interface ISearchUser {
  users: {
    id: string;
    name: string;
    imageUrl: string;
    comment: string;
    novels: INovelProfile[];
  }[];
  total: number;
}

export const usePixivSearchUser = (userName: string, page: number = 1) => {
  userName = encodeURIComponent(userName);
  const { data } = useSWR<ISearchUser>(
    `/pixiv/search/user/${userName}?page=${page}`,
  );
  return data;
};

interface ISearchNovel {
  novels: INovelProfile[];
  total: number;
}

// 搜索小说
export const usePixivSearchNovel = (novelName: string, page: number = 1) => {
  novelName = encodeURIComponent(novelName);
  const { data } = useSWR<ISearchNovel>(
    `/pixiv/search/novel/${novelName}?page=${page}`,
  );
  return data;
};
