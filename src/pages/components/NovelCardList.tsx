import PageViewer from '@/components/PageViewer';
import { getPixivNovelProfiles } from '@/utils/api';
import NovelCard from './NovelCard';

interface INovelCardList {
  novelIdList: string[];
}

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
        const novelProfileList = await getPixivNovelProfiles(showNovelIds);
        return novelProfileList.map((novel) => (
          <NovelCard {...novel} key={novel.id} />
        ));
      }}
    />
  );
}
