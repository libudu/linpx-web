import useSWR from 'swr';
import { reqGet } from './util/request';
import { IPageData, makeRestApiTemplate } from './util/restfulTemplate';

export interface IPost {
  id: string;
  ip: string;
  title: string;
  content: string;
  commentCount: number;
  createTime: number;
  tags: string[];
  refer:
    | null
    | {
        type: 'novel';
        data: string;
      }
    | {
        type: 'post';
        data: string;
      };
  _time: number;
}

// 帖子的回复
export interface IPostComment {
  id: string;
  ip: string;
  content: string;
  postId: string;
  reply: string | null;
  floor: number;
  _time: number;
}

export const postApi = {
  ...makeRestApiTemplate<IPost>('/post'),
  usePostTags: () => {
    const { data } = useSWR<{ tag: string }[]>('/post/tags', reqGet);
    return data;
  },
};

const postCommentTemplate = makeRestApiTemplate<IPostComment>('/post/comment');

export const postCommentApi = {
  postOne: postCommentTemplate.postOne,
  useIdList: postCommentTemplate.useIdList,
  useByPostId: (props: { postId: string; page: number; pageSize: number }) => {
    const { postId, page, pageSize } = props;
    const { data, revalidate } = useSWR<IPageData<IPostComment>>(
      `/post/${postId}/comment?page=${page}&pageSize=${pageSize}`,
      reqGet,
    );
    return { data, revalidate };
  },
};
