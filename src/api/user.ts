import { INovelProfile, IUserInfo } from '../types';
import { list2query, proxyImg } from '@/utils/util';
import cache from './util/cache';
import { useLinpxSWR } from '.';

export const useUserTagNovels = (userId: string, tagName: string) => {
  const data = useLinpxSWR<INovelProfile[]>(
    `/pixiv/user/${userId}/tag/${tagName}`,
  );
  data?.forEach((item) => (item.coverUrl = proxyImg(item.coverUrl)));
  return data;
};

const dealPixivUserTags = (data: IUserInfo) => {
  if (data.tags instanceof Array) {
    const tags: any = {};
    data.tags.forEach((tag: any) => (tags[tag.tag] = tag.time));
    data.tags = tags;
  }
  data.backgroundUrl = proxyImg(data.backgroundUrl);
  data.imageUrl = proxyImg(data.imageUrl);
  return data;
};

export const usePixivUser = (id: string, isCache = false) => {
  const cacheData = cache.user.get(id);
  const data = useLinpxSWR<IUserInfo>(
    cacheData ? null : `/pixiv/user/${id}${isCache ? '/cache' : ''}`,
  );
  if (cacheData) return cacheData;
  // @ts-ignore
  if (!data || data?.error) return undefined;
  dealPixivUserTags(data);
  cache.user.set(id, data);
  return data;
};

export const usePixivUserList = (idList: string[]) => {
  const { result, left } = cache.user.getList(idList);
  const data = useLinpxSWR<IUserInfo[]>(
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
