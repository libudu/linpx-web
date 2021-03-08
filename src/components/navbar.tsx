import { ArrowLeftOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { history } from 'umi';
import Drawer from './Drawer';
import ActionSheet from '@/utils/ActionSheet';

interface IHeaderProps {
  children?: any;
  leftEle?: any;
  onClickLeft?: any;
  rightEle?: any;
  onClickRight?: any;
}

export default function Navbar({
  children = '',
  leftEle, // 默认显示左箭头，优先级高于logo
  onClickLeft,
  rightEle,
  onClickRight,
}: IHeaderProps) {
  return (
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
  );
}

// 主页左边是Drawer按钮
export function HomeNavbar({ children }: { children: any }) {
  return Navbar({
    leftEle: '抽屉',
    children: children,
  });
}

export function ContentNavbar({
  children,
  backTo,
}: {
  children: any;
  backTo: string;
}) {
  return Navbar({
    leftEle: <ArrowLeftOutlined onClick={() => history.push(backTo)} />,
    rightEle: <UnorderedListOutlined onClick={ActionSheet} />,
    children,
  });
}
