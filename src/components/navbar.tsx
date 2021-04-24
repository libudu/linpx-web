import { ArrowLeftOutlined, MenuOutlined } from '@ant-design/icons';
import { history } from 'umi';
import ActionSheet from '@/utils/ActionSheet';
import classnames from 'classnames';

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
        'text-3xl text-center w-full bg-linpx h-16 font-bold z-20',
        { absolute: fixed },
      )}
    >
      <span className="flex justify-center w-2/12" onClick={onClickLeft}>
        {leftEle}
      </span>
      <span className="flex justify-center w-8/12 mx-2 u-line-1">
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
  fixed = true,
}: {
  children: any;
  backTo?: string;
  fixed?: boolean;
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
    fixed,
  });
}
