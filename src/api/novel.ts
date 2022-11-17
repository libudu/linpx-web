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
import { useLinpxSWR } from '.';

export const usePixivNovel = (id: string, cache = false) => {
  const data = useLinpxSWR<INovelInfo>(
    `/pixiv/novel/${id}${cache ? '/cache' : ''}`,
  );
  if (data) {
    data.coverUrl = proxyImg(data.coverUrl);
  }
  return data;
};

export const usePixivNovelProfiles = (idList: string[], isCache = false) => {
  const { result, left } = cache.novelProfiles.getList(idList);
  const data = useLinpxSWR<INovelProfile[]>(
    left && `/pixiv/novels${isCache ? '/cache' : ''}?${list2query(left)}`,
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
  const data = useLinpxSWR<INovelProfile[]>(
    `/pixiv/novels/recent?page=${page}`,
  );
  if (data) {
    data.forEach((item) => (item.coverUrl = proxyImg(item.coverUrl)));
    cache.novelProfiles.setList(data);
  }
  return data;
};

export const usePixivNovelAnalyse = (id: string) => {
  const { data } = useSWR<INovelAnalyse>(
    `/pixiv/novel/${id}/analyse`,
    (path: string) => linpxRequest(path, false),
  );
  return data;
};

export const readNovel = (id: string) => {
  linpxRequest(`/pixiv/novel/${id}/click`, false);
};

export const likeNovel = (id: string) => {
  linpxRequest(`/pixiv/novel/${id}/like`, false);
};

export const unlikeNovel = (id: string) => {
  linpxRequest(`/pixiv/novel/${id}/unlike`, false);
};

export const getPixivNovelComments = (id: string): Promise<INovelComment[]> => {
  return linpxRequest(`/pixiv/novel/${id}/comments`, false).then((res: any) => {
    if (res.error) {
      console.log('获取评论失败', res);
      return [];
    }
    return res.data;
  });
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

export const pixivNovelNewComment = (id: string, text: string) => {
  return linpxRequest(`/pixiv/novel/${id}/comment/new?text=${text}`, false);
};
