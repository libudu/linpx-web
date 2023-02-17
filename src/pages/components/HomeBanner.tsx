import { Carousel } from 'antd';
import MidAutumnImg from '@/assets/banner/midautumn.jpg';
import DragonIslandImg from '@/assets/banner/dragonisland.webp';
import DragonIsland1Img from '@/assets/banner/dragonisland1.webp';
import DragonIsland2Img from '@/assets/banner/dragonisland2.webp';
import { event } from '@/utils/event';
import { UpdateBanner } from '@/pages/update';
import { history } from 'umi';
import { KemonoGameBannerIntro } from '../biz/kemonoGameIntro';

const BannerBox: React.FC<{
  defaultBg?: boolean;
  backgoundImg?: string;
  clickJumpUrl?: string;
  eventInfo?: any;
}> = ({
  children,
  defaultBg = false,
  backgoundImg,
  clickJumpUrl,
  eventInfo,
}) => {
  const onClick = () => {
    // google analyse打点
    eventInfo && event(eventInfo);
    if (!clickJumpUrl) return;
    if (clickJumpUrl.startsWith('http')) {
      window.open(clickJumpUrl);
    } else {
      history.push(clickJumpUrl);
    }
  };
  // 默认背景
  if (defaultBg) {
    children = (
      <>
        <img
          className="absolute object-cover w-full h-full opacity-20"
          src={MidAutumnImg}
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
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// 首页轮播图
export default function HomeBanner() {
  return (
    <Carousel
      className="overflow-x-hidden overflow-y-visible"
      autoplay
      autoplaySpeed={5000}
      dots={false}
    >
      <BannerBox defaultBg clickJumpUrl="https://afdian.net/@orangecat">
        <div className="w-full h-full relative flex flex-col justify-center items-center">
          <div>爱发电赞助作者！</div>
          <div>点击跳转！</div>
          <div className="font-normal absolute right-1 bottom-1 text-sm text-gray-500">
            赞助服务器，回报纪念书签
          </div>
        </div>
      </BannerBox>
      <BannerBox>
        <KemonoGameBannerIntro />
      </BannerBox>
      <BannerBox defaultBg clickJumpUrl="/update">
        <UpdateBanner />
      </BannerBox>
      <BannerBox backgoundImg={MidAutumnImg} />
      <BannerBox
        eventInfo={{ category: 'game', action: '0ld_steam' }}
        clickJumpUrl="https://store.steampowered.com/app/1554470/_/"
        backgoundImg={DragonIsland1Img}
      />
      <BannerBox
        eventInfo={{ category: 'game', action: '0ld_afdian' }}
        clickJumpUrl="https://afdian.net/@apoto5"
        backgoundImg={DragonIsland2Img}
      />
      <BannerBox defaultBg clickJumpUrl="https://github.com/libudu/linpx-web">
        <div className="h-full w-full flex flex-col justify-center items-center">
          <div>开源github地址！</div>
          <div>来点个star⭐吧！</div>
        </div>
      </BannerBox>
    </Carousel>
  );
}
