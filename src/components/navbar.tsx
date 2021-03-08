import { ArrowLeftOutlined } from '@ant-design/icons';
import { history } from 'umi';

interface IHeaderProps {
  children: any;
  leftBack?: boolean;
  onClickLeft?: any;
  rightEle?: any;
}

export default function ({
  children,
  leftBack = false,
  onClickLeft,
  rightEle,
}: IHeaderProps) {
  if (!onClickLeft && leftBack) {
    onClickLeft = history.goBack;
  }
  return (
    <div className="text-3xl text-center bg-linpx h-14 font-bold flex justify-between items-center flex-nowrap">
      <span className="w-2/12" onClick={onClickLeft}>
        {leftBack ? <ArrowLeftOutlined /> : null}
      </span>
      <span
        className="w-8/12 overflow-x-hidden whitespace-nowrap mx-2"
        style={{ textOverflow: 'ellipsis' }}
      >
        {children}
      </span>
      <span className="w-2/12">{rightEle}</span>
    </div>
  );
}
