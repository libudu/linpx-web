import { history } from 'umi';
import { IUserInfo } from '@/types';
import { AfdianAvatar } from './Afdian';

// 首页用户卡片
export default function UserPreview({ id, imageUrl, name }: IUserInfo) {
  return (
    <div
      className="w-24 p-2 pt-4"
      onClick={() => history.push(`/pixiv/user/${id}`)}
    >
      <AfdianAvatar size={72} imageUrl={imageUrl} id={id} />
      <div
        className="text-sm mt-1 text-center u-line-2 whitespace-pre-line"
        style={{ wordWrap: 'break-word' }}
      >
        {name}
      </div>
    </div>
  );
}
