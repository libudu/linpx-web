import NovelCard from '@/components/NovelCard';
import { getRecentNovels } from '@/utils/api';
import PageViewer from '@/components/PageViewer';

// 每页十个，由后端接口限定
const pageSize = 10;
const TotalPage = 74;

export default function () {
  document.title = 'Linpx - 最近小说';

  return (
    <>
      <PageViewer
        total={pageSize * TotalPage}
        pageSize={pageSize}
        renderContent={async (page) => {
          const novelProfileList = await getRecentNovels(page);
          return (
            <div className="px-4">
              {novelProfileList.map((novelProfile) => (
                <NovelCard {...novelProfile} key={novelProfile.id} />
              ))}
            </div>
          );
        }}
      />
    </>
  );
}
