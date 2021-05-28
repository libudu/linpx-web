import useSWR from 'swr';
import { INovelProfile, IUserInfo } from '../types';
import { list2query } from '@/utils/util';

export const useUserTagNovels = (userId: string, tagName: string) => {
  const { data } = useSWR<INovelProfile[]>(
    `/pixiv/user/${userId}/tag/${tagName}`,
  );
  return data;
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
