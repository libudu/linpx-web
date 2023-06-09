import { useState } from 'react';
import { history } from 'umi';
import {
  SmileOutlined,
  HomeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  TagOutlined,
  HistoryOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Drawer } from 'antd-mobile';

import Navbar, { MenuIcon } from '@/components/Navbar';

import BlackLogoPng from '@/assets/logo/black_logo.png';
import WordLogoPng from '@/assets/logo/word_logo.png';
import HeaderLogoPNG from '@/assets/icon/logo.png';
import LinpicioLogoImg from '@/assets/logo/author_logo.png';
import { showSupport } from '@/pages/config';
import { isSafeMode } from '@/utils/env';

// 获取Drawer项目
export function getDrawerItem() {
  const location = history.location;
  return drawerItems.find(({ link }) => {
    if (typeof link === 'string') {
      return link === location.pathname;
    } else {
      return link.includes(location.pathname);
    }
  });
}

export let currDrawerPath = '/';

const drawerItems: IDrawerItem[] = [
  {
    icon: <HomeOutlined />,
    title: '首页',
    link: '/',
    header: <img className="h-10 pb-1.5" src={HeaderLogoPNG} />,
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
  ...(!isSafeMode
    ? [
        {
          icon: <TagOutlined />,
          title: '全站tag',
          link: '/pixiv/tags',
        },
      ]
    : []),
  {
    icon: <HistoryOutlined />,
    title: '阅读历史',
    link: '/history',
  },
  {
    icon: <AppstoreOutlined />,
    title: '最近更新',
    link: '/update',
  },
  {
    icon: <ShareAltOutlined />,
    title: '关于LINPX',
    link: '/about',
  },
];

showSupport &&
  drawerItems.push({
    icon: <HeartOutlined />,
    title: '赞助名单',
    link: '/support',
  });

// todo: 重构，使用组合模式而非嵌套做页面层次布局
export let _setRightEle: any;

// 抽屉的整体页面布局
export default function DrawerLayout({ children }: { children: any }) {
  const [open, setOpen] = useState(false);
  const [rightEle, setRightEle] = useState();
  _setRightEle = setRightEle;

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
        rightEle={rightEle}
        children={header || title}
        onClickLeft={() => setOpen(!open)}
      />
      <Drawer
        key={typeof link === 'string' ? link : link[0]}
        className="flex-grow"
        style={{ position: 'relative' }}
        sidebarStyle={{ backgroundColor: 'white', width: '70%' }}
        overlayStyle={{ visibility: 'visible', zIndex: 1 }}
        contentStyle={{ zIndex: open ? 0 : 2 }}
        open={open}
        sidebar={<DrawerSidebar onDrawerClose={() => setOpen(false)} />}
        onOpenChange={setOpen}
      >
        {children}
      </Drawer>
    </div>
  );
}

interface IDrawerItem {
  icon: any;
  title: string;
  header?: any;
  link: string | string[];
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
            const link = ele.link;
            history.push(typeof link === 'string' ? link : link[0]);
            onDrawerClose();
          }}
        >
          <div className="mr-6 text-3xl content bg-clip-text">{ele.icon}</div>
          <div className="text-xl">{ele.title}</div>
        </div>
      ))}
      {/* <div className="my-8 ml-4 text-base relative">
        <div className="opacity-50">
          <div>站长：林彼丢</div>
          <div>设计：apoto5</div>
          <div>协助：V.C</div>
          <div>顾问：空狼</div>
        </div>
        <img src={LinpicioLogoImg} className="w-24 absolute top-4 right-4" />
      </div> */}
    </div>
  );
}
