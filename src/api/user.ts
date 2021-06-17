import useSWR from 'swr';
import { INovelProfile, IUserInfo } from '../types';
import { list2query } from '@/utils/util';
import cache from './util/cache';

export const useUserTagNovels = (userId: string, tagName: string) => {
  const { data } = useSWR<INovelProfile[]>(
    `/pixiv/user/${userId}/tag/${tagName}`,
  );
  return data;
};

const dealPixivUserTags = (data: IUserInfo) => {
  if (data.tags instanceof Array) {
    const tags: any = {};
    data.tags.forEach((tag: any) => (tags[tag.tag] = tag.time));
    data.tags = tags;
  }
  return data;
};

export const usePixivUser = (id: string) => {
  const cacheData = cache.user.get(id);
  const { data } = useSWR<IUserInfo>(cacheData ? null : `/pixiv/user/${id}`);
  if (cacheData) return cacheData;
  // @ts-ignore
  if (!data || data?.error) return undefined;
  dealPixivUserTags(data);
  cache.user.set(id, data);
  return data;
};

export const usePixivUserList = (idList: string[]) => {
  const { result, left } = cache.user.getList(idList);
  const { data } = useSWR<IUserInfo[]>(
    left && `/pixiv/users?${list2query(left)}`,
  );
  if (!left) return idList.map((id) => result[id]).filter((data) => data);
  if (data) {
    data.forEach((data) => dealPixivUserTags(data));
    cache.user.setList(data);
    data.forEach((item) => (result[item.id] = item));
    return idList.map((id) => result[id]).filter((data) => data);
  }
  return data;
};
