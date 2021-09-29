import { IRouteComponentProps, history } from 'umi';
import DrawerLayout, { getDrawerItem } from './DrawerLayout';
import { InfoModal } from '@/pages/components/Modal';
import { enterNewPath } from '@/utils/history';
import { MountModal } from '@/components/LinpxModal';
import { useRef, useEffect } from 'react';

const posMap: Record<string, number> = {};
(window as any).posMap = posMap;

export default function Layout({ children }: IRouteComponentProps) {
  const isDrawerPage = Boolean(getDrawerItem());
  // 记录下历史路由
  const path = history.location.pathname;
  enterNewPath(path);
  const ref = useRef<HTMLDivElement>(null);

  // 控制组件滚动位置记忆
  const wrapperChildren = (
    <div className="h-full overflow-y-scroll" ref={ref}>
      {children}
    </div>
  );

  useEffect(() => {
    const node = ref.current;
    const lastPos = posMap[path];
    if (node) {
      // 上次位置存在则滚过去
      if (lastPos && history.action === 'POP') {
        node.scrollTo({ top: lastPos });
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
  }, [children]);

  return (
    // 最外层框架，灰色
    // 内层居中的手机，白色
    // 内层滚动层
    <>
      <div className="h-screen w-screen bg-gray-100 text-xl flex flex-shrink-0">
        <div
          className="h-screen mx-auto bg-white relative flex-grow"
          style={{ maxWidth: 448, minWidth: 300 }}
        >
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
      <InfoModal />
    </>
  );
}
