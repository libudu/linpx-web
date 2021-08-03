import { INovelInfo, INovelProfile } from '../types';
import useSWR from 'swr';
import cache from './util/cache';
import { list2query, proxyImg } from '@/utils/util';

export const usePixivNovel = (id: string) => {
  const { data } = useSWR<INovelInfo>(`/pixiv/novel/${id}`);
  if (data) {
    data.coverUrl = proxyImg(data.coverUrl);
  }
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
    data.forEach((item) => {
      result[item.id] = item;
      item.coverUrl = proxyImg(item.coverUrl);
    });
    return idList.map((id) => result[id]).filter((data) => data);
  }
  // 数据没到
  return null;
};

export const usePixivRecentNovels = (page: number = 1) => {
  const { data } = useSWR<INovelProfile[]>(`/pixiv/novels/recent?page=${page}`);
  if (data) {
    data.forEach((item) => (item.coverUrl = proxyImg(item.coverUrl)));
    cache.novelProfiles.setList(data);
  }
  return data;
};
