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

class LinpxCache<T extends { id: string }> {
  store: Map<string, T> = new Map();

  get = (id: string) => {
    return this.store.get(id);
  };

  set = (id: string, data: T) => {
    return this.store.set(id, data);
  };

  getList = (idList: string[]) => {
    const result: IMap<T> = {};
    const left: string[] = [];
    idList.forEach((id) => {
      const data = this.store.get(id);
      if (data) result[id] = data;
      else left.push(id);
    });
    return {
      result,
      left: left.length ? left : null,
    };
  };

  setList = (dataList: T[]) => {
    dataList.map((data) => this.store.set(data.id, data));
  };
}

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

const cache: {
  user: LinpxCache<IUserInfo>;
  novelProfiles: LinpxCache<INovelProfile>;
} = {
  user: new LinpxCache(),
  novelProfiles: new LinpxCache(),
};

export const usePixivNovel = (id: string) => {
  const { data } = useSWR<INovelInfo>(`/pixiv/novel/${id}`);
  return data;
};

export const usePixivNovelProfiles = (idList: string[]) => {
  const { result, left } = cache.novelProfiles.getList(idList);
  const { data } = useSWR<INovelProfile[]>(
    left && `/pixiv/novels?${list2query(left)}`,
  );
  // 全部从缓存取到了
  if (!left) return idList.map((id) => result[id]).filter((data) => data);
  // 有些缓存里没有
  // 数据到了
  if (data) {
    cache.novelProfiles.setList(data);
    data.forEach((item) => (result[item.id] = item));
    return idList.map((id) => result[id]).filter((data) => data);
  }
  // 数据没到
  return null;
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
  return data;
};

export const useFavUserIds = () => {
  const { data } = useSWR<IFavUser[]>('/fav/user');
  if (!data) return;
  return data
    .map((favUser) => favUser.id)
    .sort((a, b) => randomByDay(Number(a) * Number(b)) - 0.5);
};

export const useFavUser = () => {
  const { data } = useSWR<IFavUser[]>('/fav/user');
  return data;
};

export const useFavUserById = (id: string) => {
  const favUsers = useFavUser();
  return favUsers?.find((favUser) => favUser.id === id);
};

export const useSearchFavUser = (word: string) => {
  const { data } = useSWR<IMap<IFavUser>>('/fav/user');
  if (!data) return [];
  const idList = Object.values(data)
    .filter(({ name }) => name.includes(word))
    .map(({ id }) => id);
  return idList;
};

export const usePixivRecentNovels = (page: number = 1) => {
  const { data } = useSWR<INovelProfile[]>(`/pixiv/novels/recent?page=${page}`);
  if (data) cache.novelProfiles.setList(data);
  return data;
};

export const useUserTagNovels = (userId: string, tagName: string) => {
  const { data } = useSWR<INovelProfile[]>(
    `/pixiv/user/${userId}/tag/${tagName}`,
  );
  return data;
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
