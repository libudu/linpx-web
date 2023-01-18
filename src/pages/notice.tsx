import PageLayout from '@/components/PageLayout';
import React from 'react';
import { history } from 'umi';
import Stop167IpNotice from './biz/167ip';
import { NovelCommentById } from './pixiv/novel/[id]/components/NovelFooter/Comment';

const NoticeContent: Record<
  string,
  {
    ele: React.ReactElement;
    commentId: string;
  }
> = {
  stop167ip: {
    ele: <Stop167IpNotice />,
    commentId: '1000000000',
  },
};

const Notice: React.FC = () => {
  const id = String(history.location.query?.['id']);
  const notice = NoticeContent[id];
  if (!notice) {
    history.push('/404');
    return null;
  }
  const { ele, commentId } = notice;
  return (
    <PageLayout title="通知" rightEle={<></>}>
      <div className="m-4 ml-3">{ele}</div>
      <NovelCommentById id={commentId} />
    </PageLayout>
  );
};

export default Notice;
