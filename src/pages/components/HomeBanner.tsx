import { getQQGroupShareLink } from '@/utils/util';
import { Carousel } from 'antd';

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
        <div>快做完了！</div>
        <div className="text-xs opacity-30">骗你的，还有很多没做</div>
      </BannerBox>
      <BannerBox>
        <div>群号:576268549</div>
        <div className="flex items-center">
          点击
          <a target="_blank" href={getQQGroupShareLink(576268549)}>
            <img
              className="h-6"
              src="//pub.idqqimg.com/wpa/images/group.png"
              alt="橘猫的阅读器"
              title="橘猫的阅读器"
            />
          </a>
        </div>
        <div>欢迎反馈问题或提建议！</div>
      </BannerBox>
      <BannerBox>
        <div
          onClick={() => {
            window.open('https://weibo.com/linpicio');
          }}
        >
          <div>关注我的微博</div>
          <div>@林彼丢带橘猫</div>
          <div>点击跳转！</div>
        </div>
      </BannerBox>
      <BannerBox>
        <div
          onClick={() => {
            window.open('https://afdian.net/@LINPX');
          }}
        >
          <div>爱发电赞助！</div>
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
