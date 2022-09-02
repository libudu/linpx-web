import { makeRestApiTemplate } from './util/restfulTemplate';

interface ILinpxNovel {
  id: string;
  title: string;
  text: string;
  author: string;
  password: string;
}

const linpxNovelTemplate = makeRestApiTemplate<ILinpxNovel>('/linpx/novel');
export const linpxNovelApi = {
  postOne: linpxNovelTemplate.postOne,
  useOne: linpxNovelTemplate.useOne,
};
