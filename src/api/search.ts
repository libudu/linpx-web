import { INovelProfile, IMap, IFavUser } from '../types';
import useSWR from 'swr';
import { proxyImg } from '@/utils/util';

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
  data?.users.forEach((item) => (item.imageUrl = proxyImg(item.imageUrl)));
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
  data?.novels.forEach((item) => (item.coverUrl = proxyImg(item.coverUrl)));
  return data;
};

export const useSearchFavUser = (word: string) => {
  const { data } = useSWR<IMap<IFavUser>>('/fav/user');
  if (!data) return [];
  const idList = Object.values(data)
    .filter(({ name }) => name.includes(word))
    .map(({ id }) => id);
  return idList;
};
