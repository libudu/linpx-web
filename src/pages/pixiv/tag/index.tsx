import { IRouteComponentProps } from 'umi';
import { ContentNavbar } from '@/components/Navbar';
import { useAnalyseTag } from '@/api';
import NovelCardList from '@/components/NovelCardList';
import PageLayout from '@/components/PageLayout';

export default function PixivTag({ location }: IRouteComponentProps) {
  const tagName = location.query['tagName'];
  const title = `全站tag - ${tagName}`;
  document.title = title;

  const analyseTag = useAnalyseTag();
  const matchTagData = analyseTag?.data.find(
    (tagData) => tagData.tagName === tagName,
  );
  if (!matchTagData) {
    return <ContentNavbar backTo="/">{title}</ContentNavbar>;
  }

  const tagNovels = matchTagData.novels.sort((x, y) => Number(y) - Number(x));

  return (
    <PageLayout title={title}>
      <div className="px-4">
        <NovelCardList novelIdList={tagNovels} />
      </div>
    </PageLayout>
  );
}
