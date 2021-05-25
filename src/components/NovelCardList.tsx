import PageViewer from '@/components/PageViewer';
import { usePixivNovelProfiles } from '@/utils/api';
import NovelCard from './NovelCard';

interface INovelCardList {
  novelIdList: string[];
}

// 有一些场景可能不想要分页器，只想要多个小说卡片
export function RenderNovelCards({ novelIdList }: INovelCardList) {
  const novelProfiles = usePixivNovelProfiles(novelIdList);
  return (
    <>
      {novelProfiles.map((novel) => (
        <NovelCard {...novel} key={novel.id} />
      ))}
    </>
  );
}

// 带分页器的小说卡片列表
export default function NovelCardList({ novelIdList }: INovelCardList) {
  const pageSize = 24;
  return (
    <PageViewer
      total={novelIdList.length}
      pageSize={pageSize}
      renderContent={async (page) => {
        const novelIds = novelIdList.slice(
          (page - 1) * pageSize,
          page * pageSize,
        );
        return <RenderNovelCards novelIdList={novelIds} />;
      }}
    />
  );
}
