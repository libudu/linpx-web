import PageLayout from '@/components/PageLayout';
import React from 'react';
import { history } from 'umi';
import Stop167IpNotice from './components/167ip';
import { NovelCommentById } from '../pixiv/novel/[id]/components/NovelFooter/Comment';
import { LinpxAppNotice } from './components/linpxApp';

const NoticeContent: Record<
  string,
  {
    ele: React.ReactElement;
    title?: string;
    commentId?: string;
  }
> = {
  stop167ip: {
    ele: <Stop167IpNotice />,
    commentId: '1000000001',
  },
  linpxApp: {
    title: 'Linpx轻量app',
    ele: <LinpxAppNotice />,
  },
};

const Notice: React.FC = () => {
  const id = String(history.location.query?.['id']);
  const notice = NoticeContent[id];
  if (!notice) {
    history.push('/404');
    return null;
  }
  const { ele, commentId, title } = notice;
  return (
    <PageLayout title={title || '通知'} rightEle={<></>}>
      <div className="m-4 ml-3">{ele}</div>
      {commentId && <NovelCommentById isEmpty id={commentId} />}
    </PageLayout>
  );
};

export default Notice;
