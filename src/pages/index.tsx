import { history } from 'umi';
import { getRecommendPixivAuthors, getPixivUserList } from '@/utils/api';
import { useEffect, useState } from 'react';
import { IUserInfo } from '@/utils/api';
import { ContentTitle, ContentBox } from './components/ContentLayout';
import TransLink from './components/TransLink';

interface IBox {
  name: string;
  path: string;
  children?: any;
}

const BoxConfig: IBox[] = [
  {
    name: '作者推荐',
    path: '/pixiv/recommend/users',
  },
  {
    name: '最新小说',
    path: '/',
  },
  {
    name: '生成LINPX链接',
    path: '/',
  },
];

function UserCard({ id, imageUrl, name }: IUserInfo) {
  const [isHeight, setIsHeight] = useState<boolean>(false);

  const onImgLoad = (res: any) => {
    const ele = res.target;
    setIsHeight(ele.naturalHeight > ele.naturalWidth);
  };

  return (
    <div
      key={id}
      className="w-24 p-2 pt-4"
      onClick={() => history.push(`/pixiv/user/${id}`)}
    >
      <div
        className="rounded-full overflow-hidden flex justify-center items-center"
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
        className="text-sm mt-1 text-center u-line-2"
        style={{ wordWrap: 'break-word' }}
      >
        {name}
      </div>
    </div>
  );
}

let lastUserInfo: IUserInfo[] = [];

export default function IndexPage() {
  document.title = 'Linpx - 首页';

  const [userInfo, setUserInfo] = useState<IUserInfo[]>(lastUserInfo);

  useEffect(() => {
    getRecommendPixivAuthors().then((res) => {
      // 只取前十个作为随机推荐作者
      getPixivUserList((res as string[]).slice(0, 8)).then((res) => {
        lastUserInfo = res;
        setUserInfo(res);
        console.log(res);
      });
    });
  }, []);

  return (
    <>
      <div className="lp-bgcolor h-40 flex flex-col justify-center items-center font-bold text-3xl">
        <div>是的！</div>
        <div>还没做完！</div>
      </div>
      <div className="px-6 pb-6">
        <ContentTitle left="作者推荐" clickRightPath="/pixiv/recommend/users" />
        <ContentBox
          children={lastUserInfo.map((ele) => (
            <UserCard {...ele} />
          ))}
        />
        {/* <ContentTitle left="最新小说" clickRightPath="/" />
        <ContentBox children={456} /> */}
        <ContentTitle left="生成LINPX链接" right="" />
        <ContentBox children={TransLink()} />
      </div>
    </>
  );
}
