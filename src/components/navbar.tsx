import { history } from 'umi';
import BackImg from '@/assets/icon/back.png';
import MenuSVG from '@/assets/icon/menu.svg';
import ActionSheet from '@/utils/ActionSheet';
import classnames from 'classnames';
import { goBackOrTo } from '@/utils/history';

interface IMenuIcon {
  onClick?: () => any;
}

export const MenuIcon: React.FC<IMenuIcon> = ({ onClick }) => {
  return <img className="h-7 mt-0.5" src={MenuSVG} onClick={onClick} />;
};

interface IHeaderProps {
  children?: any;
  leftEle?: any;
  onClickLeft?: any;
  rightEle?: any;
  onClickRight?: any;
  fixed?: boolean;
}

export default function Navbar({
  children = '',
  leftEle, // 默认显示左箭头，优先级高于logo
  onClickLeft,
  rightEle,
  onClickRight,
  fixed = false,
}: IHeaderProps) {
  return (
    <div
      className={classnames(
        'flex justify-between items-center flex-nowrap',
        'text-3xl text-center w-full bg-linpx-orange font-bold z-20',
        { absolute: fixed },
      )}
      style={{ height: 60 }}
    >
      <span className="flex justify-center w-2/12" onClick={onClickLeft}>
        {leftEle}
      </span>
      <span className="u-line-1 justify-center items-center w-8/12 mx-2 leading-10">
        {children}
      </span>
      <span className="flex justify-center w-2/12" onClick={onClickRight}>
        {rightEle}
      </span>
    </div>
  );
}

export function ContentNavbar({
  children,
  backTo,
  rightEle,
}: {
  children: any;
  backTo?: string;
  rightEle?: any;
}) {
  // 如果有backTo那就回到backTo，没有就返回上一个网页
  const onClick = backTo ? () => goBackOrTo(backTo) : history.goBack;
  return Navbar({
    leftEle: <img style={{ width: 33 }} src={BackImg} onClick={onClick} />,
    rightEle: rightEle || <MenuIcon onClick={() => ActionSheet()} />,
    children,
  });
}
