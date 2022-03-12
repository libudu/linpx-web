import { RestApiTemplate } from './util/restfulTemplate';

const template = new RestApiTemplate('/post');

interface IPost {
  id: string;
  ip: string;
  title: string;
  text: string;
  refer:
    | null
    | {
        type: 'novel';
        id: string;
      }
    | {
        type: 'post';
        id: string;
      };
  _time: number;
}

// 最新帖子列表，可分页
const getRecentPosts = () => {};

// 获取一篇帖子详细信息
const getPostInfo = () => {};

// 查询指定id的回复内容
const getPostReplies = () => {};
