export const Array2Map = <T extends { id: string }>(dataList: T[]) => {
  const dataMap: IMap<T> = {};
  dataList.forEach((data) => (dataMap[data.id] = data));
  return dataMap;
};

export interface IMap<T> {
  [index: string]: T;
}

export interface ITagSet {
  [tagName: string]: number;
}

export interface IFavUser {
  id: string;
  name: string;
  afdian?: string;
}

export interface IUserInfo {
  id: string;
  novels: string[];
  name: string;
  imageUrl: string;
  comment: string;
  tags: ITagSet;
  backgroundUrl?: string;
}

export interface INovelProfile {
  id: string;
  title: string;
  userId: string;
  userName: string;
  coverUrl: string;
  tags: string[];
  desc: string;
  length: number;
  createDate: string;
}

export interface INovelInfo {
  id: string;
  title: string;
  userId: string;
  userName: string;
  coverUrl: string;
  tags: string[];
  desc: string;
  content: string;
  createDate: string;
}
