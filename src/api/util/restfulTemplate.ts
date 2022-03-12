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

export class RestApiTemplate<T = any> {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  // 分页查询
  // 返回data是分页格式数据
  getPage = ({
    page = 0,
    pageSize = 10,
  }: {
    page?: number;
    pageSize?: number;
  }): Promise<IPageData<T>> => {
    const path = this.path + makeQueryParams({ page, pageSize });
    return reqGet(path);
  };

  // 单个提交
  postOne = (data: Omit<T, 'id'>) => {
    return reqPost(this.path, data);
  };

  // 单个删除
  deleteOne = (id: number) => {
    return reqDelete(this.path + makeQueryParams({ id }));
  };
}
