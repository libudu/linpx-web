import { IRouteComponentProps, history } from 'umi';
import DrawerLayout, { getDrawerItem } from './DrawerLayout';
import { getAppWidth } from '@/utils/util';
import { SWRConfig } from 'swr';
import { linpxRequest } from '@/api/util/request';
import { InfoModal } from '@/pages/components/Modal';
import { enterNewPath } from '@/utils/history';
import { MountModal } from '@/components/LinpxModal';

export default function Layout({ children }: IRouteComponentProps) {
  const isDrawerPage = Boolean(getDrawerItem());
  // 记录下历史路由
  const path = history.location.pathname;
  enterNewPath(path);

  return (
    // 最外层框架，灰色
    // 内层居中的手机，白色
    // 内层滚动层
    <SWRConfig
      value={{
        fetcher: linpxRequest,
        revalidateOnFocus: false,
      }}
    >
      <div className="h-screen w-screen bg-gray-100 text-xl flex">
        <div
          className="h-screen mx-auto bg-white relative"
          style={{ width: getAppWidth() }}
        >
          <div className="h-screen w-full overflow-y-scroll overflow-x-hidden">
            {isDrawerPage ? <DrawerLayout children={children} /> : children}
          </div>
          <MountModal />
        </div>
      </div>
      <InfoModal />
    </SWRConfig>
  );
}
