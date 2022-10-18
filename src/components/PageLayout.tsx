import { ContentNavbar } from './Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';
import classNames from 'classnames';

interface IPageLayout {
  children: any;
  backToPath?: string;
  rightEle?: JSX.Element;
  title: string;
  // normal：子元素堆叠，使用父容器滚动，自动记录上次翻页位置
  // flex-grow：子元素自动撑起最低一个屏幕的高度
  type?: 'normal' | 'flex-grow';
}

export default function PageLayout({
  children,
  title,
  rightEle,
  backToPath = currDrawerPath,
  type,
}: IPageLayout) {
  const isFlexGrow = type === 'flex-grow';
  return (
    <div
      className={classNames('w-full', { 'h-full flex flex-col': isFlexGrow })}
    >
      <div
        className={classNames('w-full absolute top-0 z-20', {
          'flex-shrink-0': isFlexGrow,
        })}
      >
        <ContentNavbar rightEle={rightEle} backTo={backToPath}>
          {title}
        </ContentNavbar>
      </div>
      <div
        className={classNames('w-full overflow-x-hidden mt-12 pt-3', {
          'flex-grow': isFlexGrow,
        })}
      >
        {children}
      </div>
    </div>
  );
}
