import { useState } from 'react';
import { history } from 'umi';
import {
  SmileOutlined,
  HomeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Drawer } from 'antd-mobile';

import Navbar, { MenuIcon } from '@/components/Navbar';

import BlackLogoPng from '@/assets/logo/black_logo.png';
import WordLogoPng from '@/assets/logo/word_logo.png';
import HeaderLogoPNG from '@/assets/icon/logo.png';
import LinpicioLogoImg from '@/assets/logo/author_logo.png';

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
    header: <img className="h-10 pb-1.5" src={HeaderLogoPNG} />,
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
      <div
        className="flex flex-col items-center text-base"
        style={{ marginTop: '5vh', marginBottom: '2vh' }}
      >
        <img className="w-20" src={BlackLogoPng}></img>
        <img className="w-28 mr-2 mb-1 mt-2" src={WordLogoPng}></img>
        <div className="text-xl">LINPX IS NOT PIXIV</div>
      </div>
      {drawerItems.map((ele) => (
        <div
          key={ele.title}
          className="pl-9 flex items-center active:bg-gray-200"
          style={{ paddingTop: '0.75vh', paddingBottom: '0.75vh' }}
          onClick={() => {
            history.push(ele.link);
            onDrawerClose();
          }}
        >
          <div className="mr-6 text-3xl content bg-clip-text">{ele.icon}</div>
          <div className="text-xl">{ele.title}</div>
        </div>
      ))}
      <div className="my-8 ml-4 text-base relative">
        <div className="opacity-50">
          <div>站长：林彼丢</div>
          <div>设计：apoto5</div>
          <div>协助：V.C</div>
          <div>顾问：空狼</div>
        </div>
        <img src={LinpicioLogoImg} className="w-24 absolute top-4 right-4" />
      </div>
      <div></div>
    </div>
  );
}
