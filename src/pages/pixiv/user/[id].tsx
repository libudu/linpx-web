import { IRouteProps, history } from 'umi';
import { useState, useEffect, useRef } from 'react';
import { Pagination } from 'antd';
import classnames from 'classnames';
import {
  getPixivUser,
  getPixivNovelProfiles,
  IUserInfo,
  INovelProfile,
} from '@/utils/api';
import { ContentNavbar } from '@/components/Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';
import NovelCard from '@/pages/components/NovelCard';

const tagColors = [
  'bg-gray-400',
  'bg-red-400',
  'bg-red-500',
  'bg-yellow-400',
  'bg-green-400',
  'bg-green-500',
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-indigo-400',
];

function randomColor() {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
}

function TagList({ tags }: { tags: IUserInfo['tags'] }) {
  return (
    <>
      {Object.entries(tags).map(([tagName, time], index) => {
        let minWidth = '50%';
        let fontSize = '20px';
        if (index < 7) {
          if (index > 1) {
            minWidth = '33%';
            fontSize = '18px';
          }
          return (
            <div className="px-2 py-1" style={{ minWidth }} key={tagName}>
              <div
                className={classnames(
                  'py-0.5 rounded-2xl text-white px-1',
                  randomColor(),
                )}
              >
                <div style={{ fontSize, lineHeight: '24px' }}>{tagName}</div>
                <div style={{ fontSize: '14px', lineHeight: '16px' }}>
                  {time}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
      {Object.entries(tags).length > 7 && (
        <div className="px-2 py-1" style={{ minWidth: '33%' }}>
          <div
            className={classnames(
              'py-0.5 rounded-2xl font-bold text-white bg-linpx',
            )}
          >
            <div style={{ fontSize: '18px', lineHeight: '40px' }}>查看全部</div>
          </div>
        </div>
      )}
    </>
  );
}

function UserPart({
  name,
  id,
  comment,
  imageUrl,
  backgroundUrl,
  tags,
}: IUserInfo) {
  return (
    <div className="text-center pb-4 bg-yellow-100 bg-opacity-25 shadow-lg relative">
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

      <div className="flex flex-wrap mx-8 my-2">
        <TagList tags={tags} />
      </div>
    </div>
  );
}

interface INovelPart {
  total: number;
  novels: INovelProfile[];
  page: number;
  setPage: any;
}

function NovelPart({ total, novels, page, setPage }: INovelPart) {
  const novelsRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="text-center px-6 py-2 w-full" ref={novelsRef}>
        {novels.map((ele: INovelProfile) => (
          <div key={ele.id}>
            <NovelCard {...ele} />
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-6">
        <Pagination
          pageSize={pageSize}
          current={page}
          total={total}
          showSizeChanger={false}
          onChange={(page) => {
            setPage(page);
            history.push(history.location.pathname + `?page=${page}`);
            novelsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>
    </>
  );
}

const pageSize = 20;

export default function PixivUser(props: IRouteProps) {
  document.title = 'Linpx - 作者详情';
  const id = props.match.params.id;

  const [page, setPage] = useState<number>(
    Number(history.location?.query?.page) || 1,
  );

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
    <div className="h-screen flex flex-col w-full">
      <div className="flex-shrink-0">
        <ContentNavbar backTo={currDrawerPath} fixed={false}>
          作者详情
        </ContentNavbar>
      </div>
      <div className="overflow-y-scroll w-full overflow-x-hidden">
        <UserPart {...userInfo} />
        <NovelPart
          total={userInfo.novels.length}
          novels={novels}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
