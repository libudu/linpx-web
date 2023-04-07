import { isBlockUser } from '@/config/cache';
import Novel from './index';
import { IRouteProps } from 'umi';
import { usePixivNovel } from '@/api';

export default function (props: IRouteProps) {
  const id = props.match.params.id;
  const novelInfo = usePixivNovel(id, true);
  if (!novelInfo || isBlockUser(novelInfo?.userId)) {
    return <div></div>;
  }
  return <Novel {...props} />;
}
