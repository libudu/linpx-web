import { makeRestApiTemplate } from './util/restfulTemplate';

interface IPost {
  id: string;
  ip: string;
  title: string;
  content: string;
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

export const postApi = {
  ...makeRestApiTemplate<IPost>('/post'),
};
