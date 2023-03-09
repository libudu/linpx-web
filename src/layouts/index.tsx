import { IRouteComponentProps, history } from 'umi';
import DrawerLayout, { getDrawerItem } from './DrawerLayout';
import { InfoModal } from '@/pages/components/Modal';
import { enterNewPath } from '@/utils/history';
import { MountModal } from '@/components/LinpxModal';
import { useRef, useEffect, useState, RefObject } from 'react';
import AiLiao from '@/pages/biz/ailiao';

// 拦截器，在网页启动前执行一些拦截
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

// 记录页面滚动位置
const posMap: Record<string, number> = {};
(window as any).posMap = posMap;

export const useRecordLastScroll = (ref: RefObject<any>, deps: any[] = []) => {
  useEffect(() => {
    const node = ref.current;
    if (node) {
      const path = history.location.pathname;
      const lastPos = posMap[path];
      // 上次位置存在则滚过去
      if (lastPos && history.action === 'POP') {
        // 夸克游览器上，不套setTimeout将无法滚动到位置
        let count = 0;
        let timer = setInterval(() => {
          // 可能之前的页面还没渲染出来
          let totalHeight = 0;
          [...node.children].forEach(
            (ele) => (totalHeight += ele.clientHeight),
          );
          // 最多等待500ms页面加载出来
          if (totalHeight < lastPos && count < 10) {
            count += 1;
          } else {
            clearInterval(timer);
            node.scrollTo({ top: lastPos });
          }
        }, 50);
      }
      // 添加滚动监听
      const handler = (e: Event) => {
        // 上面组件里获取到的path会有延迟
        const path = history.location.pathname;
        posMap[path] = node.scrollTop;
      };
      node.addEventListener('scroll', handler);
      return () => node.removeEventListener('scroll', handler);
    }
  }, deps);
};

const BaseLayout = ({ children }: IRouteComponentProps) => {
  const isDrawerPage = Boolean(getDrawerItem());
  // 记录下历史路由
  const path = history.location.pathname;
  enterNewPath(path);
  const ref = useRef<HTMLDivElement>(null);

  // 控制组件滚动位置记忆
  let wrapperChildren = (
    <div className="h-full overflow-y-scroll" ref={ref}>
      {children}
    </div>
  );

  // 大部分情况下，滚动的都是最外层的这个ref容器
  // 小说页面中因为需要监控onScroll事件来自动伸缩，所以内部单独实现位置记录功能
  useRecordLastScroll(ref, [children]);

  const [refreshNum, setRefreshNum] = useState(0);
  for (let { check, render } of appInterceptorList) {
    // 是否被拦截
    const isIntercepted = check();
    if (isIntercepted) {
      wrapperChildren = render(() => setRefreshNum(refreshNum + 1), children);
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
