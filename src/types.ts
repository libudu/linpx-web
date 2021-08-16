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
  qqgroup?: string;
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
  coverUrl: string | undefined;
  tags: string[];
  desc: string;
  length: number;
  createDate: string;
  pixivLikeCount: number;
  likeCount: number;
  commentCount: number;
}

export interface INovelImage {
  preview: string;
  origin: string;
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
  // 系列小说
  series: {
    title: string;
    order: string;
    next: {
      id: string;
      title: string;
      order: string;
    } | null;
    prev: {
      id: string;
      title: string;
      order: string;
    } | null;
  } | null;
  // 相邻小说
  next: INovelProfile | null;
  prev: INovelProfile | null;
  // 插入图片
  images?: {
    [id: string]: INovelImage;
  };
  pixivLikeCount: number;
  pixivReadCount: number;
}

export interface INovelAnalyse {
  id: string;
  readCount: number;
  likeCount: number;
  ip: string;
  canLike: boolean;
}

export interface IAnalyseTag {
  time: string;
  data: {
    tagName: string;
    time: number;
    novels: string[];
  }[];
  take: number;
}

export interface INovelComment {
  id: string;
  content: string;
  reply: string;
  postTime: number;
  ip: string;
}
