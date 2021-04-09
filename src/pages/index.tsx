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
import RDFModal from './components/RDFModal';
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
      <RDFModal />
      <div className="px-6 pb-6">
        <ContentTitle left="作者推荐" clickRightPath="/pixiv/recommend/users" />
        <ContentBox>
          {lastUserInfo.map((ele) => (
            <UserCard key={ele.id} {...ele} />
          ))}
        </ContentBox>
        <ContentTitle left="最新小说" clickRightPath="/pixiv/recent/novels" />
        <ContentBox>
          <div className="px-2 flex">
            {novelsInfo.map((novel) => {
              return (
                <div className="p-2">
                  <NovelCard key={novel.id} {...novel} />
                </div>
              );
            })}
          </div>
        </ContentBox>
        <ContentTitle left="生成LINPX链接" right="" />
        <ContentBox children={TransLink()} />
      </div>
    </>
  );
}
