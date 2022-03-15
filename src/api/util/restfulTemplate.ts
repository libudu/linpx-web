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
interface IPageData<T> {
  records: T[];
  pageSize: number;
  total: number;
  page: number;
}

interface IGetPageParams {
  page?: number;
  pageSize?: number;
}

export const makeRestApiTemplate = <T = any>(path: string) => {
  const getPage = async ({
    page = 0,
    pageSize = 10,
  }: IGetPageParams): Promise<IPageData<T>> => {
    const fullPath = path + makeQueryParams({ page, pageSize });
    return reqGet(fullPath);
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
    usePage,
    useOne,
    postOne,
    deleteOne,
  };
};
