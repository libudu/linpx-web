import { useEffect, useState } from 'react';
import { reqDelete, reqGet, reqPost } from './request';

// 对象转查询字符串
type ParamType = number | string | undefined | null;
const makeQueryParams = (obj: Record<string, ParamType[] | ParamType>) => {
  let result = '?';
  Object.entries(obj).forEach(([key, value]) => {
    const isArray = Array.isArray(value);
    const processOne = (param: ParamType) => {
      if (param == undefined || param == null) return;
      result += `${key}=${param}&`;
    };
    if (isArray) {
      value.forEach((v) => processOne(v));
    } else {
      processOne(value);
    }
  });
  return result;
};

// 列表响应时，data的格式
export interface IPageData<T> {
  page: number;
  total: number;
  pageSize: number;
  pageTotal: number;
  records: T[];
}

interface IGetPageParams {
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

export const makeRestApiTemplate = <T = any>(path: string) => {
  const getPage = async (params: IGetPageParams): Promise<IPageData<T>> => {
    params = {
      page: 0,
      pageSize: 10,
      ...params,
    };
    const fullPath = path + makeQueryParams(params);
    return reqGet(fullPath);
  };

  const getIdList = async (ids: string[]) => {
    return reqGet(path + '/ids' + makeQueryParams({ ids }));
  };

  const usePage = (params: IGetPageParams): IPageData<T> | null => {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
      getPage(params).then((res) => setData(res));
    }, Object.values(params));
    return data;
  };

  const getOne = (id: number | string): Promise<T> => {
    return reqGet(path + '/' + id);
  };

  const useOne = (id: number | string): T | null => {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
      getOne(id).then((res) => setData(res));
    }, [id]);
    return data;
  };

  const postOne = async (data: any) => {
    return reqPost(path, data);
  };

  const deleteOne = (id: number | string) => {
    return reqDelete(path + makeQueryParams({ id }));
  };

  return {
    getPage,
    getIdList,
    usePage,
    useOne,
    postOne,
    deleteOne,
  };
};
