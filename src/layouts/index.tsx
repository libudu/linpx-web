import { IRouteComponentProps } from 'umi';
import DrawerLayout, { drawerItems, getDrawerItem } from './DrawerLayout';
import { useState } from 'react';

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
    <div className="h-screen bg-gray-100 text-xl flex">
      <div className="h-screen w-full max-w-md mx-auto bg-white overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
