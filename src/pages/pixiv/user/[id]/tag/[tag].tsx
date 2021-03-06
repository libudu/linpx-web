import { IRouteProps } from 'umi';
import { ContentNavbar } from '@/components/Navbar';
import { usePixivUser, useUserTagNovels } from '@/api';
import PageViewer from '@/components/PageViewer';
import NovelCard from '@/components/NovelCard';
import PageLayout from '@/components/PageLayout';
import { useState } from 'react';

const pageSize = 20;

export default function UserTag(props: IRouteProps) {
  document.title = 'Linpx - 作者标签';
  const { tag: tagName, id } = props.match.params;

  const userInfo = usePixivUser(id);
  const novels = useUserTagNovels(id, tagName);
  const [page, setPage] = useState<number>(1);

  const title = `${userInfo?.name}-${tagName}`;

  if (!userInfo || !novels) {
    return <ContentNavbar backTo="/">{title}</ContentNavbar>;
  }

  const { backgroundUrl, imageUrl, name } = userInfo;
  const showNovels = novels.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PageLayout title={title} backToPath={`/pixiv/user/${id}`}>
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
        <div className="my-2 mx-10 font-black text-2xl">{name}</div>
        <div className="text-4xl font-black">{`#${tagName}`}</div>
      </div>

      <div className="mx-6">
        <PageViewer
          pageSize={pageSize}
          total={novels.length}
          onPageChange={setPage}
        >
          {showNovels.map((novel) => (
            <NovelCard {...novel} key={novel.id} />
          ))}
        </PageViewer>
      </div>
    </PageLayout>
  );
}
