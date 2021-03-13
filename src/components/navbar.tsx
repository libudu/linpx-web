import { ArrowLeftOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { history } from 'umi';
import ActionSheet from '@/utils/ActionSheet';
import Drawer from './Drawer';
import Loading from './Loading';

interface IHeaderProps {
  children?: any;
  leftEle?: any;
  onClickLeft?: any;
  rightEle?: any;
  onClickRight?: any;
  loading?: boolean;
}

export default function Navbar({
  children = '',
  leftEle, // 默认显示左箭头，优先级高于logo
  onClickLeft,
  rightEle,
  onClickRight,
  loading,
}: IHeaderProps) {
  return (
    <div>
      <div className="text-3xl text-center bg-linpx h-14 font-bold flex justify-between items-center flex-nowrap">
        <span className="w-2/12" onClick={onClickLeft}>
          {leftEle}
        </span>
        <span
          className="w-8/12 overflow-x-hidden whitespace-nowrap mx-2"
          style={{ textOverflow: 'ellipsis' }}
        >
          {children}
        </span>
        <span className="w-2/12" onClick={onClickRight}>
          {rightEle}
        </span>
      </div>
    </div>
  );
}

// 主页左边是Drawer按钮
export function HomeNavbar({
  children,
  loading,
}: {
  children: any;
  loading?: boolean;
}) {
  return Navbar({
    leftEle: '',
    children: children,
  });
}

export function ContentNavbar({
  children,
  backTo,
  loading,
}: {
  children: any;
  backTo?: string;
  loading?: boolean;
}) {
  // 如果有backTo那就回到backTo，没有就返回上一个网页
  const onClick = backTo
    ? () => {
        history.push(backTo);
      }
    : history.goBack;
  return Navbar({
    leftEle: <ArrowLeftOutlined onClick={onClick} />,
    rightEle: (
      <UnorderedListOutlined
        onClick={() => {
          ActionSheet();
        }}
      />
    ),
    children,
    loading,
  });
}
