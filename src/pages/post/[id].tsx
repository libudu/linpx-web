import React, { useRef, useState } from 'react';
import { IRouteProps } from 'umi';
import { Pagination } from 'antd';

import { postApi, postCommentApi } from '@/api';
import { IPostComment } from '@/api/post';

import PageLayout from '@/components/PageLayout';
import NameTime from './components/NameTime';
import { NovelReferById } from './components/NovelRefer';
import CommentModal from './components/CommentModal';

const PostCommentRefer: React.FC<IPostComment> = ({
  ip,
  _time,
  content,
  floor,
}) => {
  return (
    <div
      className="mx-4 rounded-md px-2 py-1 mt-2 mb-0.5 lp-bgcolor"
      style={{ boxShadow: '0 0 4px #aaa' }}
    >
      <NameTime ip={ip} _time={_time} rightEle={floor + 'F'} />
      <div>{content}</div>
    </div>
  );
};

const PostComment: React.FC<{
  commentList: IPostComment[];
  onClickReply: (comment: IPostComment) => void;
}> = ({ commentList, onClickReply }) => {
  const replyCommentIds = commentList
    .map((comment) => comment.reply)
    .filter((i) => i) as string[];
  const replyCommentMap = postCommentApi.useIdList(replyCommentIds);
  console.log(replyCommentMap);
  return (
    <>
      {commentList.length ? (
        commentList.map((postComment) => {
          const replyComment =
            postComment.reply && replyCommentMap?.[postComment.reply];
          return (
            <div
              className="py-1 px-3"
              style={{ borderBottom: '1px solid #eee' }}
            >
              <NameTime
                ip={postComment.ip}
                _time={postComment._time}
                rightEle={
                  <>
                    <span
                      className="text-yellow-400 mr-2"
                      onClick={() => onClickReply(postComment)}
                    >
                      回复
                    </span>
                    {postComment.floor}F
                  </>
                }
              />
              {replyComment && <PostCommentRefer {...replyComment} />}
              <div className="py-1">{postComment.content}</div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-20 text-gray-400">
          快来添加第一条回复吧
        </div>
      )}
    </>
  );
};

// 通过postId拿到分页评论数据
const PostCommentById: React.FC<{
  id: string;
  rootRef: React.RefObject<HTMLDivElement>;
}> = ({ id, rootRef }) => {
  const [commentPage, setCommentPage] = useState(1);
  const { data: commentData, revalidate } = postCommentApi.useByPostId({
    postId: id,
    page: commentPage,
    pageSize: 10,
  });
  const [replyComment, setReplyComment] = useState<IPostComment | undefined>(
    undefined,
  );
  const [showCommentModal, setShowCommentModal] = useState(false);
  // 评论数据
  if (!commentData) return <></>;
  const { records, pageTotal, pageSize, total, page } = commentData;
  return (
    <div>
      <PostComment
        commentList={records}
        onClickReply={(postComment) => {
          setReplyComment(postComment);
          setShowCommentModal(true);
        }}
      />
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
        onClick={() => {
          setReplyComment(undefined);
          setShowCommentModal(true);
        }}
      >
        回复帖子
      </div>
      <CommentModal
        show={showCommentModal}
        setShow={setShowCommentModal}
        postId={id}
        replyComment={replyComment}
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
      <PageLayout title="帖子详情" rightEle={<></>}>
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
    <PageLayout title="帖子详情" rightEle={<></>}>
      <div className="mb-16 text-base" ref={rootRef}>
        <div className="px-3 mb-3">
          <div className="text-2xl pt-2 pb-1 font-bold">{title}</div>
          <NameTime ip={ip} _time={createTime} />
          <div className="mt-1">{content}</div>
          {suffixElement && <div className="mt-4">{suffixElement}</div>}
        </div>
        <div className="bg-gray-100" style={{ height: 10 }}></div>
        <PostCommentById id={id} rootRef={rootRef} />
      </div>
    </PageLayout>
  );
};

export default Post;
