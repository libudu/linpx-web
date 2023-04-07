import { IRouteProps } from 'umi';
import User from './index';
import { isBlockUser } from '@/config/cache';

export default function (props: IRouteProps) {
  const id = props.match.params.id;
  const isBlock = isBlockUser(id);
  if (isBlock) {
    return <div></div>;
  }
  return <User {...props} />;
}
