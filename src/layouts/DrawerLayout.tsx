import {
  SmileOutlined,
  HomeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  TagOutlined,
} from '@ant-design/icons';
import Navbar, { MenuIcon } from '@/components/Navbar';
import { Drawer } from 'antd-mobile';
import { history } from 'umi';

import BlackLogoPng from '@/assets/logo/black_logo.png';
import WordLogoPng from '@/assets/logo/word_logo.png';
import HeaderLogoPNG from '@/assets/icon/logo.png';
import { useState } from 'react';

// 获取Drawer项目
export function getDrawerItem() {
  return drawerItems.find((ele) => ele.link === location.pathname);
}

export let currDrawerPath = '/';

export const drawerItems: IDrawerItem[] = [
  {
    icon: <HomeOutlined />,
    title: '首页',
    link: '/',
    header: <img className="h-8" src={HeaderLogoPNG} />,
  },
  {
    icon: <SearchOutlined />,
    title: '搜索',
    link: '/search',
  },
  {
    icon: <SmileOutlined />,
    title: '推荐作者',
    link: '/pixiv/fav/user',
  },
  {
    icon: <ClockCircleOutlined />,
    title: '最近小说',
    link: '/pixiv/recent/novels',
  },
  {
    icon: <TagOutlined />,
    title: '全站tag',
    link: '/pixiv/tags',
  },
  {
    icon: <ShareAltOutlined />,
    title: '关于LINPX',
    link: '/about',
  },
  {
    icon: <HeartOutlined />,
    title: '赞助我们',
    link: '/support',
  },
];

// 抽屉的整体页面布局
export default function DrawerLayout({ children }: { children: any }) {
  const [open, setOpen] = useState(false);

  const drawerItem = getDrawerItem();
  if (!drawerItem) {
    history.push('/404');
    return <div />;
  }
  const { title, header, link } = drawerItem;
  return (
    <div className="h-full flex flex-col">
      <Navbar
        leftEle={<MenuIcon />}
        children={header || title}
        onClickLeft={() => setOpen(!open)}
      />
      <Drawer
        key={link}
        className="flex-grow"
        style={{ position: 'relative' }}
        sidebarStyle={{ backgroundColor: 'white', width: '70%' }}
        overlayStyle={{ visibility: 'visible', zIndex: 1 }}
        contentStyle={{ zIndex: open ? 0 : 2 }}
        open={open}
        sidebar={<DrawerSidebar onDrawerClose={() => setOpen(false)} />}
        onOpenChange={setOpen}
      >
        <div>{children}</div>
      </Drawer>
    </div>
  );
}

interface IDrawerItem {
  icon: any;
  title: string;
  header?: any;
  link: string;
}

// 抽屉的sidebar
function DrawerSidebar({ onDrawerClose }: { onDrawerClose: any }) {
  return (
    <div>
      <div className="flex flex-col items-center mt-12 mb-6 text-base">
        <img className="w-20" src={BlackLogoPng}></img>
        <img className="w-28 mr-2 mb-1 mt-2" src={WordLogoPng}></img>
        <div className="text-xl">LINPX IS NOT PIXIV</div>
      </div>
      {drawerItems.map((ele) => (
        <div
          key={ele.title}
          className="pl-10 py-2 flex items-center active:bg-gray-200"
          onClick={() => {
            history.push(ele.link);
            onDrawerClose();
          }}
        >
          <div className="mr-6 text-3xl content bg-clip-text">{ele.icon}</div>
          <div className="text-xl">{ele.title}</div>
        </div>
      ))}
    </div>
  );
}
