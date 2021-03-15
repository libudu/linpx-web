import { history } from 'umi';
import { getRecommendPixivAuthors, getPixivUserList } from '@/utils/api';
import { useEffect, useState } from 'react';
import { IUserInfo } from '@/utils/api';

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
];

function ContentBox({ name, path, children }: IBox) {
  return (
    <div className="px-6 mt-6">
      <div className="mb-3">
        <div
          className="inline-block font-bold text-3xl"
          style={{ width: '60%' }}
          children={name}
        />
        <div
          className="inline-block text-base text-right"
          style={{ width: '40%' }}
          children={
            <span
              style={{ borderBottom: '1px solid black' }}
              children={'查看全部'}
              onClick={() => {
                history.push(path);
              }}
            />
          }
        />
      </div>
      <div
        className="lp-shadow lp-bgcolor flex overflow-x-scroll"
        style={{ minHeight: '6rem' }}
      >
        {children}
      </div>
    </div>
  );
}

let lastUserInfo: IUserInfo[] = [];

export default function IndexPage() {
  const [userInfo, setUserInfo] = useState<IUserInfo[]>(lastUserInfo);
  useEffect(() => {
    getRecommendPixivAuthors(true).then((res) => {
      // 只取前十个作为随机推荐作者
      getPixivUserList((res as string[]).slice(0, 10)).then((res) => {
        lastUserInfo = res;
        setUserInfo(res);
        console.log(res);
      });
    });
  }, []);

  const recommendUsers = lastUserInfo.map((ele) => {
    return (
      <div
        key={ele.id}
        className="w-16 m-4 mb-2"
        onClick={() => history.push(`/pixiv/user/${ele.id}`)}
      >
        <div
          style={{
            backgroundImage: `url(${ele.imageUrl})`,
            width: '4.5rem',
            height: '4.5rem',
          }}
          className="rounded-full bg-center"
        />
        <div className="text-sm text-center" style={{ wordWrap: 'break-word' }}>
          {ele.name}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="lp-bgcolor h-40 flex flex-col justify-center items-center font-bold text-3xl">
        <div>是的！</div>
        <div>还没做完！</div>
      </div>
      <ContentBox {...BoxConfig[0]}>{recommendUsers}</ContentBox>
      <ContentBox {...BoxConfig[1]}>456</ContentBox>
      <div>转链功能</div>
    </div>
  );
}
