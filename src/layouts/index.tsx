import { IRouteComponentProps } from 'umi';
import DrawerLayout, { drawerItems, getDrawerItem } from './DrawerLayout';
import { useState } from 'react';
import { getAppWidth } from '@/utils/util';

export default function Layout({ children, location }: IRouteComponentProps) {
  const drawerItem = getDrawerItem();
  const [openDrawer, setOpenDrawer] = useState(false);
  if (drawerItem) {
    children = (
      <DrawerLayout
        title={drawerItem.title}
        open={openDrawer}
        onClickDrawer={() => {
          setOpenDrawer(!openDrawer);
        }}
        children={children}
      />
    );
  }
  return (
    // 最外层框架，灰色
    // 内层居中的手机，白色
    // 内层滚动层
    <div className="h-screen w-screen bg-gray-100 text-xl flex">
      <div
        className="h-screen mx-auto bg-white relative"
        style={{ width: getAppWidth() }}
      >
        <div className="h-screen w-full overflow-y-scroll overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
