import { IRouteComponentProps } from 'umi';
import DrawerLayout, { getDrawerItem } from './DrawerLayout';
import { useState } from 'react';
import { getAppWidth } from '@/utils/util';

export default function Layout({ children }: IRouteComponentProps) {
  const isDrawerPage = Boolean(getDrawerItem());

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
          {isDrawerPage ? <DrawerLayout children={children} /> : { children }}
        </div>
      </div>
    </div>
  );
}
