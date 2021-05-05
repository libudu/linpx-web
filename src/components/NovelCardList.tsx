import PageViewer from '@/components/PageViewer';
import { getPixivNovelProfiles } from '@/utils/api';
import NovelCard from './NovelCard';

// 有一些场景可能不想要分页器，只想要多个小说卡片
export async function renderNovelCards(novelIdList: string[]) {
  const novelProfileList = await getPixivNovelProfiles(novelIdList);
  if (novelProfileList.length === 0) return null;
  return (
    <>
      {novelProfileList.map((novel) => (
        <NovelCard {...novel} key={novel.id} />
      ))}
    </>
  );
}

interface INovelCardList {
  novelIdList: string[];
}

// 带分页器的小说卡片列表
export default function NovelCardList({ novelIdList }: INovelCardList) {
  const pageSize = 24;
  return (
    <PageViewer
      total={novelIdList.length}
      pageSize={pageSize}
      renderContent={async (page) => {
        const showNovelIds = novelIdList.slice(
          (page - 1) * pageSize,
          page * pageSize,
        );
        return await renderNovelCards(showNovelIds);
      }}
    />
  );
}
