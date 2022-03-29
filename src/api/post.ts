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
  _time: number;
}

export const postApi = {
  ...makeRestApiTemplate<IPost>('/post'),
};

const postCommentTemplate = makeRestApiTemplate<IPostComment>('/post/comment');

export const postCommentApi = {
  postOne: postCommentTemplate.postOne,
  getIdList: postCommentTemplate.getIdList,
  useByPostId: (props: { postId: string; page: number; pageSize: number }) => {
    const { postId, page, pageSize } = props;
    const { data, revalidate } = useSWR<IPageData<IPostComment>>(
      `/post/${postId}/comment?page=${page}&pageSize=${pageSize}`,
      reqGet,
    );
    return { data, revalidate };
  },
};
