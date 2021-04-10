import { history } from 'umi';
import {
  getRecommendPixivAuthors,
  getPixivUserList,
  getRecentNovels,
  IUserInfo,
  INovelProfile,
} from '@/utils/api';
import { useEffect, useState } from 'react';
import { ContentTitle, ContentBox } from './components/ContentLayout';
import TransLink from './components/TransLink';
import { InfoModal, showInfoModal } from './components/Modal';
import { Carousel } from 'antd';

// 首页用户卡片
function UserCard({ id, imageUrl, name }: IUserInfo) {
  const [isHeight, setIsHeight] = useState<boolean>(false);

  const onImgLoad = (res: any) => {
    const ele = res.target;
    setIsHeight(ele.naturalHeight > ele.naturalWidth);
  };

  return (
    <div
      className="w-24 p-2 pt-4"
      onClick={() => history.push(`/pixiv/user/${id}`)}
    >
      <div
        className="rounded-full overflow-hidden flex justify-center items-center bg-gray-200"
        style={{
          width: '4.5rem',
          height: '4.5rem',
        }}
      >
        <img
          style={isHeight ? { width: '100%' } : { height: '100%' }}
          src={imageUrl}
          loading="lazy"
          onLoad={onImgLoad}
        />
      </div>
      <div
        className="text-sm mt-1 text-center u-line-2 whitespace-pre-line"
        style={{ wordWrap: 'break-word' }}
      >
        {name}
      </div>
    </div>
  );
}

// 首页小说卡片
function NovelCard({ coverUrl, title, id, userName }: INovelProfile) {
  return (
    <div
      className="lp-shadow h-full text-sm flex-grow-0 flex-shrink-0 overflow-hidden flex flex-col"
      style={{ width: '6.5rem', wordBreak: 'keep-all' }}
      onClick={() => id && history.push(`/pixiv/novel/${id}`)}
    >
      {coverUrl ? (
        <div className="h-24 w-full overflow-hidden flex items-center">
          <img className="w-full" src={coverUrl} loading="lazy" />
        </div>
      ) : (
        <div className="h-24 w-full bg-gray-200" />
      )}
      <div className="flex flex-col justify-center flex-grow">
        <div className="u-line-2 m-1 mb-0 text-center font-bold text-sm whitespace-pre-line">
          {title}
        </div>
        <div className="u-line-1 m-1 mt-0 text-center text-xs whitespace-pre-line">
          {userName}
        </div>
      </div>
    </div>
  );
}

// 首页轮播图
function Banner() {
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

let lastUserInfo: IUserInfo[] = Array(8).fill({
  imageUrl: '',
  name: '\n\n',
});

export default function IndexPage() {
  document.title = 'Linpx - 首页';

  // 红龙基金
  useEffect(() => {
    const initRDF =
      String(history.location.query?.from).toLocaleLowerCase() === 'rdf';
    if (initRDF) {
      showInfoModal({
        title: '红龙基金新人礼',
        children: (
          <div className="text-base">
            <div>礼品兑换码</div>
            <div>I8HLK-DQWR3-QJ404</div>
            <div>BQD0H-JBBCM-FALVH</div>
            <div>G69FV-WIIP7-EX9JQ</div>
          </div>
        ),
      });
    }
  }, []);

  // 加载首页作者
  const [userInfo, setUserInfo] = useState<IUserInfo[]>(lastUserInfo);
  useEffect(() => {
    getRecommendPixivAuthors().then((res) => {
      // 只取前十个作为随机推荐作者
      getPixivUserList((res as string[]).slice(0, 8)).then((res) => {
        lastUserInfo = res;
        setUserInfo(res);
      });
    });
  }, []);

  // 加载首页小说
  const emptyNovel = {
    title: '\n',
    userName: '\n',
  };
  const [novelsInfo, setNovelsInfo] = useState<INovelProfile[]>(
    Array(8).fill(emptyNovel),
  );
  useEffect(() => {
    getRecentNovels().then((res) => {
      setNovelsInfo(res);
    });
  }, []);

  return (
    <>
      <Banner />
      <InfoModal />
      <div className="px-6 pb-6">
        <ContentTitle
          left="作者推荐"
          clickRightPath="/pixiv/recommend/users"
          onClickInfo={() => {
            showInfoModal({
              title: '作者推荐',
              children: (
                <div className="text-base">
                  <div>推荐一些不错的作者</div>
                  <div>主要是兽文作者</div>
                  <div>每次刷新时随机排序</div>
                  <div>欢迎举荐或自荐作者</div>
                  <div>加群反馈：576268549</div>
                </div>
              ),
            });
          }}
        />
        <ContentBox>
          {lastUserInfo.map((ele, index) => (
            <UserCard key={ele.id || index} {...ele} />
          ))}
        </ContentBox>
        <ContentTitle
          left="最新小说"
          clickRightPath="/pixiv/recent/novels"
          onClickInfo={() => {
            showInfoModal({
              title: '最新小说',
              children: (
                <div className="text-base">
                  <div>推荐作者按时间线排序的小说</div>
                  <div>可以翻到很久很久前的小说</div>
                </div>
              ),
            });
          }}
        />
        <ContentBox>
          <div className="px-2 flex">
            {novelsInfo.map((novel, index) => {
              return (
                <div className="p-2" key={novel.id || index}>
                  <NovelCard {...novel} />
                </div>
              );
            })}
          </div>
        </ContentBox>
        <ContentTitle
          left="生成LINPX链接"
          right=""
          onClickInfo={() => {
            showInfoModal({
              title: '生成LINPX链接',
              children: (
                <div className="text-base break-all">
                  <div>将pixiv链接转为linpx</div>
                  <div>从而不需要翻墙、登录，点开即阅</div>
                  <br />
                  <div>当前支持作者和小说两种格式链接</div>
                  <div className="text-left">
                    <div>作者举例：https://www.pixiv.net/users/32809296</div>
                    <div>
                      小说举例：https://www.pixiv.net/novel/show.php?id=14198407
                    </div>
                  </div>
                </div>
              ),
            });
          }}
        />
        <ContentBox children={TransLink()} />
      </div>
    </>
  );
}
