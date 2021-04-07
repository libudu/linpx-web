import { IRouteProps, history } from 'umi';
import { useState, useEffect, useRef } from 'react';
import { Pagination } from 'antd';
import { getPixivUser, getPixivNovelProfiles, IUserInfo } from '@/utils/api';
import { ContentNavbar } from '@/components/Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';
import NovelCard from '@/components/NovelCard';

// 小说简介
interface INovelProfile {
  id: string;
  title: string;
  coverUrl: string;
  tags: string[];
  userId: string;
  userName: string;
  desc: string;
}

function UserCard({ name, id, comment, imageUrl, backgroundUrl }: IUserInfo) {
  return (
    <div className="text-center pt-10 pb-4 bg-yellow-100 bg-opacity-25 shadow-lg relative">
      <div
        className="w-full h-28 bg-center absolute"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="flex justify-center pt-10 rounded-full">
        <div
          style={{ backgroundImage: `url(${imageUrl})` }}
          className="h-36 w-36 rounded-full z-10 border-solid border-8 border-yellow-100 bg-center"
        />
      </div>
      <div className="my-2 mx-10 font-bold text-4xl">{name}</div>

      <div className="my-2 px-16 text-lg text-blue-400">Pixiv id: {id}</div>

      <div className="whitespace-pre-line text-lg px-12">{comment}</div>
    </div>
  );
}

const pageSize = 20;

export default function PixivUser(props: IRouteProps) {
  document.title = 'Linpx - 作者详情';
  const id = props.match.params.id;

  const [page, setPage] = useState<number>(
    Number(history.location?.query?.page) || 1,
  );

  const novelsRef = useRef<HTMLDivElement>(null);

  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [novels, setNovels] = useState<INovelProfile[]>();

  useEffect(() => {
    getPixivUser(id).then((res) => {
      // @ts-ignore
      if (res?.error) return props.history.push('/404');
      setUserInfo(res);

      // 当前页码数小于1或大于最大时，需要修正
      const total = res.novels.length;
      const maxPage = Math.ceil(total / pageSize);
      const truePage = Math.min(Math.max(page, 1), maxPage);

      const novels = res.novels.slice(
        (truePage - 1) * pageSize,
        truePage * pageSize,
      );
      getPixivNovelProfiles(novels).then((res) => {
        console.log(res);
        setNovels(res.slice().reverse());
      });
    });
  }, [page]);

  if (!userInfo || !novels) {
    return <ContentNavbar backTo="/">作者详情</ContentNavbar>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-shrink-0">
        <ContentNavbar backTo={currDrawerPath} fixed={false}>
          作者详情
        </ContentNavbar>
      </div>
      <div className="overflow-scroll w-full">
        <UserCard {...userInfo} />
        <div className="text-center px-6 py-2" ref={novelsRef}>
          {novels.map((ele: INovelProfile) => (
            <div key={ele.id}>
              <NovelCard {...ele} />
            </div>
          ))}
        </div>
        <div className="flex justify-center my-6">
          <Pagination
            pageSize={pageSize}
            current={page}
            total={userInfo.novels.length}
            showSizeChanger={false}
            onChange={(page) => {
              setPage(page);
              history.push(history.location.pathname + `?page=${page}`);
              console.log(
                novelsRef.current?.scrollIntoView({ behavior: 'smooth' }),
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
