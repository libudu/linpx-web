import { history } from 'umi';
import { useState } from 'react';
import { IUserInfo } from '@/utils/api';

// 首页用户卡片
export default function UserPreview({ id, imageUrl, name }: IUserInfo) {
  const [isHeight, setIsHeight] = useState<boolean>(false);

  const onImgLoad = (res: any) => {
    const ele = res.target;
    setIsHeight(ele.naturalHeight > ele.naturalWidth);
  };

  return (
    <div
      className="w-24 p-2 pt-4"
      onClick={() => history.push(`/pixiv/user/${id}`)}
    >
      <div
        className="rounded-full overflow-hidden flex justify-center items-center bg-gray-200"
        style={{
          width: '4.5rem',
          height: '4.5rem',
        }}
      >
        <img
          style={isHeight ? { width: '100%' } : { height: '100%' }}
          src={imageUrl}
          loading="lazy"
          onLoad={onImgLoad}
        />
      </div>
      <div
        className="text-sm mt-1 text-center u-line-2 whitespace-pre-line"
        style={{ wordWrap: 'break-word' }}
      >
        {name}
      </div>
    </div>
  );
}
