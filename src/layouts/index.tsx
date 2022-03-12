import { IRouteComponentProps, history } from 'umi';
import DrawerLayout, { getDrawerItem } from './DrawerLayout';
import { InfoModal } from '@/pages/components/Modal';
import { enterNewPath } from '@/utils/history';
import { MountModal } from '@/components/LinpxModal';
import { useRef, useEffect, useState } from 'react';
import FirstTips from '@/pages/components/FirstTips';

// 记录页面滚动位置
const posMap: Record<string, number> = {};
(window as any).posMap = posMap;

// 初次使用弹出提示框，防爬虫
const getJumpConfirm = () => {
  return Boolean(JSON.parse(localStorage.getItem('jumpConfirm') || 'false'));
};
const setJumpConfirm = (state: boolean) => {
  localStorage.setItem('jumpConfirm', JSON.stringify(state));
};

export default function Layout({ children }: IRouteComponentProps) {
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

  useEffect(() => {
    const node = ref.current;
    const lastPos = posMap[path];
    if (node) {
      // 上次位置存在则滚过去
      if (lastPos && history.action === 'POP') {
        // 夸克游览器上，不套setTimeout将无法滚动到位置
        setTimeout(() => {
          node.scrollTo({ top: lastPos });
        }, 1);
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

  // 第一次访问进行安全提示，避免狗腾讯的爬虫封禁
  const jumpConfirm = getJumpConfirm();
  const [jumpConfirmState, setJumpConfirmState] = useState(jumpConfirm);
  if (!jumpConfirmState) {
    wrapperChildren = (
      <FirstTips
        onConfirm={() => {
          setJumpConfirmState(true);
          setJumpConfirm(true);
        }}
      />
    );
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
}
