import { IRouteProps } from 'umi';
import { ContentNavbar } from '@/components/Navbar';
import { getFavUserTagInfo } from '@/utils/api';
import NovelCardList from '@/components/NovelCardList';
import PageLayout from '@/components/PageLayout';

export default function PixivTag(props: IRouteProps) {
  const { tag: tagName } = props.match.params;
  const title = `全站tag - ${tagName}`;
  document.title = title;

  const favUserData = getFavUserTagInfo();
  const matchTagData = favUserData.data.find(
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
