import { Carousel } from 'antd';

// 首页轮播图
export default function HomeBanner() {
  const Box = ({ children }: { children: any }) => (
    <div className="lp-bgcolor h-40 flex flex-col justify-center items-center font-bold text-2xl text-center">
      {children}
    </div>
  );
  return (
    <Carousel autoplay dots={false}>
      <Box>
        <div>
          <div>是的！</div>
          <div>还没做完！</div>
        </div>
      </Box>
      <Box>
        <div>群号:576268549</div>
        <div>欢迎反馈问题或提建议！</div>
      </Box>
      <Box>
        <div
          onClick={() => {
            window.open('https://weibo.com/linpicio');
          }}
        >
          <div>关注我的微博</div>
          <div>@林彼丢带橘猫</div>
          <div>点击跳转！</div>
        </div>
      </Box>
      <Box>
        <div
          onClick={() => {
            window.open('https://afdian.net/@LINPX');
          }}
        >
          <div>爱发电赞助！</div>
          <div>点击跳转！</div>
        </div>
      </Box>
      <Box>
        <div
          onClick={() => {
            window.open('https://afdian.net/@LINPX');
          }}
        >
          <div>开源github地址！</div>
          <div>来点个star⭐吧！</div>
        </div>
      </Box>
    </Carousel>
  );
}
