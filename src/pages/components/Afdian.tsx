import AfdianImg from '@/assets/icon/afdian.png';
import { openInfoModal, closeInfoModal } from '@/pages/components/Modal';
import classnames from 'classnames';
import { Avatar } from 'antd';
import { useFavUserById } from '@/api';
import { showAfdian } from '../config';

export { AfdianImg };

export const openAfdianUrl = (user: string, url: string) => {
  openInfoModal({
    title: '前往爱发电',
    children: (
      <>
        <div>你将前往 {user} 的爱发电页面。</div>
        <div>可以赞助你喜欢的作者。</div>
        <div>不要忘记备注你是从linpx来的哦！</div>
      </>
    ),
    footer: [
      { text: '返回', onPress: closeInfoModal },
      {
        text: '确认',
        onPress: () => {
          window.open(url);
          closeInfoModal();
        },
      },
    ],
  });
};

interface AfdianButtonProps {
  url: string;
  user: string;
}

interface AfdianIconProps {
  style?: React.CSSProperties;
  className?: string;
}

interface AfdianAvatarProps {
  imageUrl: string;
  size: number;
  id: string;
}
export const AfdianAvatar: React.FC<AfdianAvatarProps> = ({
  size,
  imageUrl,
  id,
}) => {
  const afdianUrl = useFavUserById(id)?.afdian;
  return (
    <div className="relative">
      <Avatar src={imageUrl} size={size} />
      {showAfdian && afdianUrl && (
        <AfdianIcon
          className="absolute"
          style={{ bottom: 0, right: 0, boxShadow: '2px 2px 4px #aaa' }}
        />
      )}
    </div>
  );
};

export const AfdianIcon: React.FC<AfdianIconProps> = ({ className, style }) => {
  return (
    <div
      className={classnames(
        'w-5 h-5 rounded-full flex justify-center items-center bg-purple-500',
        className,
      )}
      style={style}
    >
      <img className="w-3" src={AfdianImg} />
    </div>
  );
};
