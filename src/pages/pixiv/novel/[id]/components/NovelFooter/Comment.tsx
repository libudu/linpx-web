import {
  deletePixivNovelComment,
  getPixivNovelComments,
  pixivNovelNewComment,
} from '@/api';
import { closeModal, openModal } from '@/components/LinpxModal';
import CommentModal from '@/pages/pixiv/novel/[id]/components/NovelFooter/CommentModal';
import { INovelComment } from '@/types';
import { Toast } from 'antd-mobile';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { BORDER } from '../..';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { isAdmin } from '@/utils/admin';
import { isElementVisible } from '@/utils/util';

const CommentHeader = ({
  index,
  ip,
  postTime,
}: {
  index: number;
  ip: string;
  postTime: number;
}) => {
  const time = new Date(postTime).toLocaleString().slice(2, -3);
  return (
    <div className="text-lg">
      <span className="font-bold">{index}F</span>
      <span className="ml-2">{ip}</span>
      <span className="ml-2 text-gray-300">{time}</span>
    </div>
  );
};

// 一条评论
const Comment: React.FC<
  INovelComment & {
    index: number;
    replyEle?: ReactElement;
    onDelete?: () => void;
  }
> = ({ content, postTime, index, ip, replyEle, onClick, onDelete }) => {
  const showDelete = isAdmin();
  return (
    <div className="pl-4 pr-2 py-2" style={{ borderTop: BORDER }}>
      <div className="flex justify-between">
        <CommentHeader index={index} ip={ip} postTime={postTime} />
        {showDelete && (
          <div
            className="text-base pr-4 rounded-lg cursor-pointer"
            onClick={onDelete}
          >
            删除
          </div>
        )}
      </div>
      {replyEle}
      <div onClick={onClick} className="mt-1 text-base px-2">
        {content}
      </div>
    </div>
  );
};

// 评论中的回复元素
const CommentReply: React.FC<{ comments: INovelComment[]; reply: string }> = (
  props,
) => {
  const { comments, reply } = props;
  const index = comments.findIndex(({ id }) => id === reply);
  if (!reply || index === -1) {
    return null;
  }
  const comment = comments[index];
  const { ip, postTime, content } = comment;
  return (
    <div
      className="mx-4 rounded-md px-2 py-1 my-1.5 lp-bgcolor"
      style={{ boxShadow: '0 0 4px #aaa' }}
    >
      <CommentHeader index={index + 1} ip={ip} postTime={postTime} />
      <div className="text-base px-2">{content}</div>
    </div>
  );
};

interface NovelCommentProps {
  id: string;
  comments: INovelComment[];
  isEmpty?: boolean;
  commentRef?: React.RefObject<HTMLDivElement>;
  showInput: boolean;
  onCommentSuccess: () => any;
  onCommentDelete: () => void;
}

// 打开回复框
const openCommentModal = ({
  novelId,
  replyInfo,
  isEmpty,
  onCommentSuccess,
}: {
  novelId: string;
  replyInfo?: {
    reply: string;
    comments: INovelComment[];
  };
  isEmpty?: boolean;
  onCommentSuccess: () => any;
}) => {
  openModal({
    children: (
      <CommentModal
        replyEle={replyInfo ? <CommentReply {...replyInfo} /> : undefined}
        onSubmit={async (content) => {
          const res = await pixivNovelNewComment(
            novelId,
            content,
            replyInfo?.reply,
            isEmpty,
          );
          if (res.error) {
            Toast.info('评论失败', 1.0, undefined, false);
            return false;
          } else {
            Toast.info('评论成功', 1.0, undefined, false);
            await onCommentSuccess();
            closeModal();
            return true;
          }
        }}
      />
    ),
  });
};

const NovelComment: React.FC<NovelCommentProps> = ({
  id,
  isEmpty,
  comments,
  commentRef,
  showInput,
  onCommentSuccess,
  onCommentDelete,
}) => {
  const [commentReverse, setCommentReverse] = useState(true);
  // 发表评论后滚动到底部
  const firstRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  if (!comments) return <></>;
  const orderComments = commentReverse ? [...comments].reverse() : comments;
  return (
    <div className="w-full" style={{ borderTop: BORDER }} ref={commentRef}>
      <div
        className="flex justify-between items-baseline px-4 py-3"
        ref={firstRef}
      >
        <div className="text-3xl font-black">评论</div>
        {commentReverse ? (
          <div onClick={() => setCommentReverse(false)}>
            倒序
            <CaretUpOutlined />
          </div>
        ) : (
          <div onClick={() => setCommentReverse(true)}>
            正序
            <CaretDownOutlined />
          </div>
        )}
      </div>
      <div className="w-full">
        {comments.length === 0 ? (
          <div
            className="h-32 flex justify-center items-center text-gray-400"
            style={{ borderTop: BORDER }}
          >
            快来添加第一条评论吧
          </div>
        ) : (
          orderComments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                index={comments.indexOf(comment) + 1}
                {...comment}
                onClick={() => {
                  openCommentModal({
                    novelId: id,
                    isEmpty,
                    replyInfo: {
                      reply: comment.id,
                      comments,
                    },
                    onCommentSuccess,
                  });
                }}
                onDelete={async () => {
                  await deletePixivNovelComment(comment.id);
                  await onCommentDelete();
                }}
                replyEle={<CommentReply comments={comments} {...comment} />}
              />
            );
          })
        )}
      </div>
      <div className="h-12 mb-2" ref={endRef} />
      <div
        className="py-3 pl-6 text-gray-400 fixed linpx-width bg-white transition-all duration-500"
        style={{ borderTop: BORDER, bottom: showInput ? 0 : -100 }}
        onClick={() => {
          openCommentModal({
            novelId: id,
            isEmpty,
            onCommentSuccess: async () => {
              await onCommentSuccess();
              const ref = commentReverse ? firstRef : endRef;
              const ele = ref.current;
              if (ele && !isElementVisible(ele)) {
                ele.scrollIntoView({ behavior: 'smooth' });
              }
            },
          });
        }}
      >
        添加评论
      </div>
    </div>
  );
};

export const NovelCommentById: React.FC<{
  id: string;
  isEmpty?: boolean;
  showInput?: boolean;
}> = ({ id, showInput = true, isEmpty }) => {
  // 加载及刷新评论数据
  const [comments, setComments] = useState<INovelComment[]>([]);
  const refreshComments = async () => {
    const comments = await getPixivNovelComments(id);
    setComments(comments);
  };
  useEffect(() => {
    refreshComments();
  }, []);
  return (
    <NovelComment
      id={id}
      isEmpty={isEmpty}
      showInput={showInput}
      comments={comments}
      onCommentSuccess={refreshComments}
      onCommentDelete={refreshComments}
    />
  );
};

export default NovelComment;
