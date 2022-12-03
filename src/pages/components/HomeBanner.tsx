import { Carousel } from 'antd';
import MidAutumnImg from '@/assets/banner/midautumn.jpg';
import DragonIslandImg from '@/assets/banner/dragonisland.webp';
import DragonIsland1Img from '@/assets/banner/dragonisland1.webp';
import DragonIsland2Img from '@/assets/banner/dragonisland2.webp';
import { event } from '@/utils/event';

const BannerBox: React.FC = ({ children }) => {
  return (
    <div className="lp-bgcolor h-40 flex flex-col justify-center items-center font-black text-2xl text-center">
      {children}
    </div>
  );
};

// 首页轮播图
export default function HomeBanner() {
  return (
    <Carousel autoplay dots={false}>
      <BannerBox>
        <div
          onClick={() => {
            window.open('https://afdian.net/@orangecat');
          }}
        >
          <div>爱发电赞助作者！</div>
          <div>点击跳转！</div>
        </div>
      </BannerBox>
      <BannerBox>
        <img className="w-full h-full object-cover" src={MidAutumnImg} />
      </BannerBox>
      <BannerBox>
        <img
          className="w-full h-full object-cover"
          src={DragonIsland1Img}
          onClick={() => {
            event({ category: 'game', action: '0ld_steam' });
            open('https://store.steampowered.com/app/1554470/_/', '_blank');
          }}
        />
      </BannerBox>
      <BannerBox>
        <img
          className="w-full h-full object-cover"
          src={DragonIsland2Img}
          onClick={() => {
            event({ category: 'game', action: '0ld_afdian' });
            open('https://afdian.net/@apoto5', '_blank');
          }}
        />
      </BannerBox>
      <BannerBox>
        <div
          onClick={() => {
            window.open('https://github.com/libudu/linpx-web');
          }}
        >
          <div>开源github地址！</div>
          <div>来点个star⭐吧！</div>
        </div>
      </BannerBox>
    </Carousel>
  );
}
