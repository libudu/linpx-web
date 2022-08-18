import PageLayout from '@/components/PageLayout';
import { IRouteComponentProps } from 'umi';
import LinpxNovelWidget from './components/LinpxNovelWidget';
import { useFileInfo } from './edit';

export default function ({ location }: IRouteComponentProps) {
  const fileInfo = useFileInfo(location.query['file'] as string);
  return (
    <PageLayout title={fileInfo?.title || ''}>
      {fileInfo && <LinpxNovelWidget text={fileInfo.text} />}
    </PageLayout>
  );
}
