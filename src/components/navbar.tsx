import { ArrowLeftOutlined, MenuOutlined } from '@ant-design/icons';
import { history } from 'umi';
import ActionSheet from '@/utils/ActionSheet';
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
    <div className="text-3xl text-center bg-linpx h-16 font-bold flex justify-between items-center flex-nowrap">
      <span className="flex justify-center w-2/12" onClick={onClickLeft}>
        {leftEle}
      </span>
      <span
        className="flex justify-center w-8/12 overflow-x-hidden whitespace-nowrap mx-2"
        style={{ textOverflow: 'ellipsis' }}
      >
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
      <MenuOutlined
        onClick={() => {
          ActionSheet();
        }}
      />
    ),
    children,
    loading,
  });
}
