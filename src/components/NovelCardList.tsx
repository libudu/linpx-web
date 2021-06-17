import PageViewer from '@/components/PageViewer';
import NovelCardSkeleton from '@/skeleton/NovelCardSkeleton';
import { usePixivNovelProfiles } from '@/api';
import { useState } from 'react';
import NovelCard from './NovelCard';

interface INovelCardList {
  novelIdList: string[];
}

// 有一些场景可能不想要分页器，只想要多个小说卡片
export function RenderNovelCards({ novelIdList }: INovelCardList) {
  const novelProfiles = usePixivNovelProfiles(novelIdList);

  return (
    <>
      {novelProfiles ? (
        novelProfiles.map((novel) => <NovelCard {...novel} key={novel.id} />)
      ) : (
        <NovelCardSkeleton number={novelIdList.length} />
      )}
    </>
  );
}

// 带分页器的小说卡片列表
export default function NovelCardList({ novelIdList }: INovelCardList) {
  const pageSize = 24;

  const [page, setPage] = useState<number>(1);

  const novelIds = novelIdList.slice((page - 1) * pageSize, page * pageSize);
  // 预加载下一页小说
  const preloadNovelIds = novelIdList.slice(
    page * pageSize,
    (page + 1) * pageSize,
  );
  usePixivNovelProfiles(preloadNovelIds);

  return (
    <PageViewer
      pageSize={pageSize}
      total={novelIdList.length}
      onPageChange={setPage}
    >
      <RenderNovelCards novelIdList={novelIds} />
    </PageViewer>
  );
}
