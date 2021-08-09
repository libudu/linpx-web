import {
  INovelAnalyse,
  INovelComment,
  INovelInfo,
  INovelProfile,
} from '../types';
import useSWR from 'swr';
import cache from './util/cache';
import { list2query, proxyImg } from '@/utils/util';
import { linpxRequest } from './util/request';
import { useEffect } from 'react';

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

export const usePixivNovelRead = (id: string) => {
  useEffect(() => {
    linpxRequest(`/pixiv/novel/${id}/click`, false);
    console.log(`read novel ${id}`);
  }, []);
};

export const usePixivNovelAnalyse = (id: string) => {
  const { data } = useSWR<INovelAnalyse>(
    `/pixiv/novel/${id}/analyse`,
    (path: string) => linpxRequest(path, false),
  );
  return data;
};

export const likeNovel = (id: string) => {
  linpxRequest(`/pixiv/novel/${id}/like`, false);
};

export const unlikeNovel = (id: string) => {
  linpxRequest(`/pixiv/novel/${id}/unlike`, false);
};

export const usePixivNovelComments = (
  id: string,
  useCache: boolean,
): INovelComment[] | null => {
  const { data } = useSWR(`/pixiv/novel/${id}/comments`, (path: string) =>
    linpxRequest(path, useCache),
  );
  if (data?.error) {
    return null;
  }
  return data?.data;
};
