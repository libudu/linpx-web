import { postApi, postCommentApi } from '@/api';
import { closeModal, openModal } from '@/components/LinpxModal';
import PageLayout from '@/components/PageLayout';
import { Pagination } from 'antd';
import { Toast } from 'antd-mobile';
import { throttle } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IRouteProps } from 'umi';
import NameTime from './components/NameTime';
import { NovelReferById } from './components/NovelRefer';

interface ICommentModal {
  show: boolean;
  setShow: (state: boolean) => void;
  postId: string;
  onSubmitSuccess?: () => void;
}

// 最大评论字数
const MAX_COMMENT_LENGTH = 10000;

const CommentModal: React.FC<ICommentModal> = ({
  show,
  setShow,
  postId,
  onSubmitSuccess,
}) => {
  const [data, setData] = useState({ text: '' });
  const ref = useRef<HTMLTextAreaElement>(null);
  // 自动聚焦输入框
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);
  // 提交防抖
  const submitComment = useCallback(
    throttle(
      async () => {
        if (data.text.length > MAX_COMMENT_LENGTH) {
          Toast.info('字数过多超过10000字，提交失败！');
          return;
        }
        const res = await postCommentApi.postOne({
          postId,
          content: data.text,
        });
        if (res.error) {
          Toast.info('评论失败', 1.0, undefined, false);
        } else {
          Toast.info('评论成功', 1.0, undefined, false);
          setShow(false);
          onSubmitSuccess && onSubmitSuccess();
        }
      },
      1000,
      { trailing: false },
    ),
    [],
  );
  if (!show) return <></>;
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 z-20"
      onClick={() => setShow(false)}
    >
      <div
        className="w-full absolute bottom-0 h-72 lp-bgcolor px-4 py-5"
        style={{ boxShadow: '0 -2px 4px -1px #aaa' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48">
          <div
            className="absolute rounded-xl top-0 left-0 w-full h-full pointer-events-none"
            style={{ boxShadow: '0 0 4px #aaa inset' }}
          />
          <textarea
            ref={ref}
            defaultValue={data.text}
            className="w-full border-0 z-30 p-1.5 resize-none"
            style={{ height: '100%' }}
            onChange={(e: any) => (data.text = e.target.value)}
          />
        </div>
        <div className="flex mt-3 flex-row-reverse">
          <div
            className="px-6 py-1 text-lg bg-linpx-orange rounded-full"
            onClick={submitComment}
          >
            发帖
          </div>
        </div>
      </div>
    </div>
  );
};

const PostComment: React.FC<{
  id: string;
  rootRef: React.RefObject<HTMLDivElement>;
}> = ({ id, rootRef }) => {
  const [commentPage, setCommentPage] = useState(1);
  const { data: commentData, revalidate } = postCommentApi.useByPostId({
    postId: id,
    page: commentPage,
    pageSize: 10,
  });
  const [showCommentModal, setShowCommentModal] = useState(false);
  // 评论数据
  if (!commentData) return <></>;
  const { records, pageTotal, pageSize, total, page } = commentData;
  return (
    <div>
      {records.length ? (
        records.map(({ ip, content, _time }, index) => (
          <div className="py-1 px-2" style={{ borderBottom: '1px solid #eee' }}>
            <NameTime
              className="text-base"
              ip={ip}
              _time={_time}
              rightEle={(page - 1) * pageSize + index + 1 + 'F'}
            />
            <div className="py-1">{content}</div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-20 text-gray-400">
          快来添加第一条回复吧
        </div>
      )}
      {pageTotal > 1 && (
        <div className="flex justify-center my-4">
          <Pagination
            pageSize={pageSize}
            current={page}
            total={total}
            showSizeChanger={false}
            onChange={(e) => {
              rootRef.current?.scrollIntoView({ behavior: 'smooth' });
              setCommentPage(e);
            }}
          />
        </div>
      )}
      <div
        className="w-full py-3 pl-6 absolute bottom-0 text-gray-400 bg-white"
        style={{ borderTop: '1px solid #ccc' }}
        onClick={() => setShowCommentModal(true)}
      >
        回复帖子
      </div>
      <CommentModal
        show={showCommentModal}
        setShow={setShowCommentModal}
        postId={id}
        onSubmitSuccess={() => {
          revalidate();
        }}
      />
    </div>
  );
};

const Post: React.FC<{ match: IRouteProps }> = ({ match }) => {
  const id: string = match.params.id;
  const rootRef = useRef<HTMLDivElement>(null);
  const res = postApi.useOne(id);
  if (!res) {
    return (
      <PageLayout title="帖子详情">
        <></>
      </PageLayout>
    );
  }
  const { title, content, ip, createTime, refer } = res;
  let suffixElement = null;
  if (refer?.type == 'novel') {
    suffixElement = <NovelReferById id={refer.data} />;
  }
  return (
    <PageLayout title="帖子详情">
      <div className="mb-16" ref={rootRef}>
        <div className="px-2 mb-4">
          <div className="text-3xl py-3 font-bold">{title}</div>
          <NameTime ip={ip} _time={createTime} />
          <div>{content}</div>
          {suffixElement}
        </div>
        <div className="bg-gray-100" style={{ height: 10 }}></div>
        <PostComment id={id} rootRef={rootRef} />
      </div>
    </PageLayout>
  );
};

export default Post;
