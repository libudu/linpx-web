import { IRouteProps, history } from 'umi';
import { useState, useEffect, useRef } from 'react';
import { Pagination } from 'antd';
import {
  getPixivUser,
  getPixivNovelProfiles,
  IUserInfo,
  INovelProfile,
} from '@/utils/api';
import { ContentNavbar } from '@/components/Navbar';
import { TagBoxList, TagBoxListModal } from '@/components/TagBox';
import { currDrawerPath } from '@/layouts/DrawerLayout';
import NovelCard from '@/pages/components/NovelCard';

function UserPart({
  name,
  id,
  comment,
  imageUrl,
  backgroundUrl,
  tags,
}: IUserInfo) {
  console.log('user part');
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="text-center pb-4 bg-yellow-100 bg-opacity-25 shadow-lg relative">
      <TagBoxListModal
        tags={tags}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
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

      <div className="mx-8 mr-6 my-2">
        <TagBoxList
          tags={tags}
          showTotalButton
          showCount={7}
          clickShowTotal={() => setShowModal(true)}
          onClickTag={(tagName) => {
            console.log(tagName);
          }}
        />
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
          <NovelCard key={ele.id} {...ele} />
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
