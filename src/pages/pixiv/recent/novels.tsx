import NovelCard from '@/components/NovelCard';
import { usePixivRecentNovels } from '@/api';
import PageViewer from '@/components/PageViewer';
import { useState } from 'react';
import NovelCardSkeleton from '@/skeleton/NovelCardSkeleton';

// 每页十个，由后端接口限定
const pageSize = 10;
const TotalPage = 200;

function RecentNovels() {
  document.title = 'Linpx - 最近小说';
  const [page, setPage] = useState<number>(0);
  const novels = usePixivRecentNovels(page);
  // 预加载下一页的小说
  usePixivRecentNovels(page + 1);

  return (
    <div className="px-4">
      <PageViewer
        pageSize={pageSize}
        total={pageSize * TotalPage}
        onPageChange={setPage}
      >
        {novels ? (
          novels.map((novelProfile) => (
            <NovelCard {...novelProfile} key={novelProfile.id} />
          ))
        ) : (
          <NovelCardSkeleton number={pageSize} />
        )}
      </PageViewer>
    </div>
  );
}

export default RecentNovels;
