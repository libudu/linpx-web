import { getQQGroupShareLink } from '@/utils/util';
import { Carousel } from 'antd';
import MidAutumnImg from '@/assets/banner/midautumn.jpg';

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
        <img className="w-full h-full object-cover" src={MidAutumnImg} />
      </BannerBox>
      <BannerBox>
        <div>快做完了！</div>
        <div className="text-xs opacity-30">骗你的，还有很多没做</div>
      </BannerBox>
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
