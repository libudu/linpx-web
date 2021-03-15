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
        >
          {name}
        </div>
        <div
          className="inline-block text-base text-right"
          style={{ width: '40%' }}
        >
          <span
            style={{ borderBottom: '1px solid black' }}
            onClick={() => {
              history.push(path);
            }}
          >
            查看全部
          </span>
        </div>
      </div>
      <div className="lp-shadow lp-bgcolor" style={{ minHeight: '8rem' }}>
        {children}
      </div>
    </div>
  );
}

export default function IndexPage() {
  const [userInfo, setUserInfo] = useState<IUserInfo[]>();
  useEffect(() => {
    getRecommendPixivAuthors().then((res) => {
      getPixivUserList((res as string[]).slice(0, 10)).then((res) => {
        setUserInfo(res);
        console.log(res);
      });
    });
  });

  return (
    <div>
      <div className="lp-bgcolor h-40 flex flex-col justify-center items-center font-bold text-3xl">
        <div>是的！</div>
        <div>还没做完！</div>
      </div>
      <ContentBox {...BoxConfig[0]}>123</ContentBox>
      <ContentBox {...BoxConfig[1]}>456</ContentBox>
      <div>转链功能</div>
    </div>
  );
}
