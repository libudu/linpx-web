import { IRouteComponentProps, history } from 'umi';
import DrawerLayout, { getDrawerItem } from './DrawerLayout';
import { InfoModal } from '@/pages/components/Modal';
import { enterNewPath } from '@/utils/history';
import { MountModal } from '@/components/LinpxModal';
import { useRef, useEffect, useState, RefObject } from 'react';
import AiLiao from '@/pages/biz/ailiao';
import { checkFromReadResource } from '@/pages/biz/readresource';
import { useRecordLastScroll } from '@/utils/scrollRecord';

// 拦截器，在网页启动前执行一些拦截，可能导向新的页面
interface AppInterceptor {
  check: () => boolean;
  render: (refresh: () => void, children: JSX.Element) => JSX.Element;
}
const appInterceptorList: AppInterceptor[] = [];
export const registerAppInterceptor = (interceptor: AppInterceptor) => {
  appInterceptorList.push(interceptor);
};

// 目前使用的拦截器
// 需要申请google adscene，暂时取消首屏提示
// require('./FirstTips');
// 已经过期了的停服通知
// require('./Stop');

const BaseLayout = ({ children }: IRouteComponentProps) => {
  const isDrawerPage = Boolean(getDrawerItem());
  // 记录下历史路由
  const path = history.location.pathname;
  enterNewPath(path);

  // 控制组件滚动位置记忆
  const ref = useRef<HTMLDivElement>(null);
  let wrapperChildren = (
    <div className="h-full overflow-y-scroll" ref={ref}>
      {children}
    </div>
  );

  useEffect(() => {
    checkFromReadResource();
  }, []);

  // 大部分情况下，滚动的都是最外层的这个ref容器
  // 小说页面中因为需要监控onScroll事件来自动伸缩，所以内部单独实现位置记录功能
  useRecordLastScroll(ref, [children]);

  const [refreshNum, setRefreshNum] = useState(0);
  for (let { check, render } of appInterceptorList) {
    // 是否被拦截
    const isIntercepted = check();
    if (isIntercepted) {
      wrapperChildren = render(
        () => setRefreshNum(refreshNum + 1),
        wrapperChildren,
      );
      break;
    }
  }

  return (
    // 最外层框架，灰色
    // 内层居中的手机，白色
    // 内层滚动层
    <>
      <InfoModal />
      <div className="h-screen w-screen bg-gray-100 text-xl">
        <div className="h-screen linpx-width bg-white relative">
          <div className="h-screen w-full overflow-y-scroll overflow-x-hidden">
            {isDrawerPage ? (
              <DrawerLayout children={wrapperChildren} />
            ) : (
              wrapperChildren
            )}
          </div>
          <MountModal />
        </div>
      </div>
    </>
  );
};

// 不需要使用linpx基础框架的路由
const noLayoutPageList = [
  {
    path: '/ailiao',
    children: <AiLiao />,
  },
];

export default function Layout(props: IRouteComponentProps) {
  for (const { path, children } of noLayoutPageList) {
    if (location.pathname.startsWith(path)) {
      return children;
    }
  }
  return <BaseLayout {...props} />;
}
