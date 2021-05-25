import { IRouteProps } from 'umi';
import { ContentNavbar } from '@/components/Navbar';
import { usePixivUser, useUserTagNovels } from '@/utils/api';
import PageViewer from '@/components/PageViewer';
import NovelCard from '@/components/NovelCard';
import PageLayout from '@/components/PageLayout';

const pageSize = 20;

export default function UserTag(props: IRouteProps) {
  document.title = 'Linpx - 作者标签';
  const { tag: tagName, id } = props.match.params;

  const userInfo = usePixivUser(id);
  const novels = useUserTagNovels(id, tagName);

  const title = `${userInfo?.name}-${tagName}`;

  if (!userInfo) {
    return <ContentNavbar backTo="/">{title}</ContentNavbar>;
  }

  const { backgroundUrl, imageUrl, name } = userInfo;

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
        <div className="my-2 mx-10 font-bold text-2xl">{name}</div>
        <div className="text-4xl font-bold">{`#${tagName}`}</div>
      </div>

      {novels && (
        <div className="mx-6">
          <PageViewer
            total={novels.length}
            pageSize={pageSize}
            renderContent={async (page) => {
              const showNovels = novels.slice(
                (page - 1) * pageSize,
                page * pageSize,
              );
              return showNovels.map((novel) => (
                <NovelCard {...novel} key={novel.id} />
              ));
            }}
          />
        </div>
      )}
    </PageLayout>
  );
}
