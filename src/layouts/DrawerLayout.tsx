import MenuSVG from '@/assets/icon/menu.svg';
import HeaderLogoPNG from '@/assets/icon/logo.png';

import {
  SmileOutlined,
  HomeOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { Drawer } from 'antd-mobile';
import { history } from 'umi';

import LogoImg from '@/assets/logo/app_logo.png';

// 获取Drawer项目
export function getDrawerItem() {
  return drawerItems.find((ele) => ele.link === location.pathname);
}

export let currDrawerPath = '/';

// 抽屉的整体页面布局
export default function DrawerLayout({
  title,
  onClickDrawer,
  children,
  open,
}: {
  title: string;
  onClickDrawer: any;
  children: any;
  open: boolean;
}) {
  currDrawerPath = history.location.pathname;
  // 如果是首页，title显示的是logo
  let header: any = title;
  if (currDrawerPath === '/') {
    header = <img className="h-8" src={HeaderLogoPNG} />;
  }
  return (
    <div className="h-full flex flex-col">
      <Navbar
        leftEle={<img className="h-6 mt-1" src={MenuSVG} />}
        children={header}
        onClickLeft={onClickDrawer}
      />
      <Drawer
        className="flex-grow"
        style={{ position: 'relative' }}
        sidebarStyle={{ backgroundColor: 'white', width: '70%' }}
        overlayStyle={{ visibility: 'visible', zIndex: 1 }}
        contentStyle={{ zIndex: open ? 0 : 2 }}
        open={open}
        sidebar={DrawerSidebar({ onClickDrawer })}
        onOpenChange={onClickDrawer}
        children={children}
      />
    </div>
  );
}

interface IDrawerItem {
  icon: any;
  title: string;
  link: string;
}

export const drawerItems: IDrawerItem[] = [
  {
    icon: <HomeOutlined />,
    title: '首页',
    link: '/',
  },
  {
    icon: <SmileOutlined />,
    title: '推荐作者',
    link: '/pixiv/recommend/users',
  },
  {
    icon: <ShareAltOutlined />,
    title: '关于Linpx',
    link: '/about',
  },
  {
    icon: <HeartOutlined />,
    title: '赞助我们',
    link: '/support',
  },
];

// 抽屉的sidebar
function DrawerSidebar({ onClickDrawer }: { onClickDrawer: any }) {
  return (
    <div>
      <div className="flex flex-col items-center mt-8 mb-2 text-base">
        <img className="w-20" src={LogoImg}></img>
        <div>橘猫的阅读器</div>
        <div>Linpx Is Not PiXiv</div>
      </div>
      {drawerItems.map((ele) => (
        <div
          key={ele.title}
          className="pl-4 py-2 flex items-center active:bg-gray-200"
          onClick={() => {
            history.push(ele.link);
            onClickDrawer();
          }}
        >
          <div className="mr-6 text-2xl content bg-clip-text">{ele.icon}</div>
          <div className="text-lg">{ele.title}</div>
        </div>
      ))}
    </div>
  );
}
