import { Carousel } from 'antd';
import LinpxBadge from '@/assets/logo/badge.png';
import { event } from '@/utils/event';
import { isRecentlyUpdated, UpdateBanner } from '@/pages/update';
import { history } from 'umi';
import { showSupport } from '../config';
import { scrollIntoHavingSomething } from './HavingSomething';

import AppLogoImg from '@/assets/logo/app_logo.png';
import MidAutumnImg from '@/assets/banner/midautumn.jpg';
import LibraryImg from '@/assets/banner/bg_library.jpg';
import DragonIsland1Img from '@/assets/banner/dragonisland1.webp';
import DragonIsland2Img from '@/assets/banner/dragonisland2.webp';

const jumpUrl = (url: string) => {
  if (!url) return;
  if (url.startsWith('http')) {
    window.open(url);
  } else {
    history.push(url);
  }
};

const BannerBox: React.FC<{
  defaultBg?: boolean | 'library';
  backgoundImg?: string;
  onClickBanner?: () => void;
}> = ({ children, defaultBg = false, backgoundImg, onClickBanner }) => {
  // 默认背景
  if (defaultBg) {
    children = (
      <>
        <img
          className="absolute object-cover w-full h-full opacity-30"
          src={defaultBg === 'library' ? LibraryImg : MidAutumnImg}
        />
        <div className="z-10 w-full h-full">{children}</div>
      </>
    );
  }
  // 指定背景
  if (backgoundImg) {
    children = (
      <>
        <img
          className="absolute object-cover w-full h-full"
          src={backgoundImg}
        />
        <div className="z-10 w-full h-full">{children}</div>
      </>
    );
  }
  return (
    <div
      className="lp-bgcolor h-40 flex flex-col justify-center items-center font-black text-2xl text-center relative"
      onClick={onClickBanner}
    >
      {children}
    </div>
  );
};

// 首页轮播图
export default function HomeBanner() {
  return (
    <div className="relative">
      <Carousel
        className="overflow-x-hidden overflow-y-visible"
        autoplay
        autoplaySpeed={5000}
        dots={false}
      >
        <BannerBox
          defaultBg="library"
          onClickBanner={() => jumpUrl('/notice?id=linpxApp')}
        >
          <div className="w-full h-full flex justify-center items-center mr-8">
            <img className="w-16 h-16 mr-4" src={AppLogoImg} />
            <div>
              <div>轻量安卓端 app 上线！</div>
              <div>点击查看详情！</div>
            </div>
          </div>
        </BannerBox>
        {showSupport && (
          <BannerBox
            defaultBg
            onClickBanner={() => jumpUrl('https://afdian.net/@orangecat')}
          >
            <div className="w-full h-full relative flex flex-col justify-center items-center">
              <div>爱发电赞助作者！</div>
              <div>点击跳转！</div>
            </div>
          </BannerBox>
        )}
        {isRecentlyUpdated() && (
          <BannerBox defaultBg onClickBanner={() => jumpUrl('/update')}>
            <UpdateBanner />
          </BannerBox>
        )}
        <BannerBox
          onClickBanner={() => {
            event({
              category: 'game',
              action: '0ld_steam',
            });
            jumpUrl('https://store.steampowered.com/app/1554470/_/');
          }}
          backgoundImg={DragonIsland1Img}
        />
        <BannerBox
          onClickBanner={() => {
            event({
              category: 'game',
              action: '0ld_afdian',
            });
            jumpUrl('https://afdian.net/@apoto5');
          }}
          backgoundImg={DragonIsland2Img}
        />
        <BannerBox
          defaultBg
          onClickBanner={() => jumpUrl('https://github.com/libudu/linpx-web')}
        >
          <div className="h-full w-full flex flex-col justify-center items-center">
            <div>开源github地址！</div>
            <div>来点个star⭐吧！</div>
          </div>
        </BannerBox>
      </Carousel>
      {showSupport && (
        <img
          className="w-16 h-16 absolute right-2 -bottom-4 z-10"
          src={LinpxBadge}
          onClick={() => window.open('https://afdian.net/@orangecat')}
        />
      )}
    </div>
  );
}
