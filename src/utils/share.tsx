import { linpxRequest } from '@/api/util/request';
import { openModal } from '@/components/LinpxModal';
import NovelShare from '@/pages/pixiv/novel/[id]/components/NovelFooter/Share';
import { INovelInfo } from '@/types';

export const shareNovel = async (id: string) => {
  const novelInfo = await linpxRequest<INovelInfo>(`/pixiv/novel/${id}`);
  openModal({
    children: <NovelShare novelInfo={novelInfo} />,
  });
};
