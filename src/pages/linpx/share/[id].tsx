import { linpxNovelApi } from '@/api/linpx';
import PageLayout from '@/components/PageLayout';
import { IRouteComponentProps } from 'umi';
import LinpxNovelWidget from '../components/LinpxNovelWidget';

export default function ({ match }: IRouteComponentProps) {
  const { id } = match.params as any;
  const novel = linpxNovelApi.useOne(id);
  if (!novel) return null;
  const { title, text } = novel;
  return (
    <PageLayout title={title} rightEle={<div></div>}>
      <LinpxNovelWidget text={text} />
    </PageLayout>
  );
}
