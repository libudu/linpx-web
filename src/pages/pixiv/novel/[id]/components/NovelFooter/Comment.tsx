import { pixivNovelNewComment } from '@/api';
import { closeModal, openModal } from '@/components/LinpxModal';
import CommentModal from '@/pages/pixiv/novel/[id]/components/NovelFooter/CommentModal';
import { INovelComment } from '@/types';
import { stringHash } from '@/utils/util';
import { Toast } from 'antd-mobile';
import React, { useRef, useState } from 'react';
import { BORDER } from '../..';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

// 一条评论
const Comment: React.FC<INovelComment & { index: number }> = ({
  content,
  postTime,
  index,
  ip,
  onClick,
}) => {
  const date = new Date(postTime);
  const time =
    date.toLocaleDateString('zh').replaceAll('/', '-') +
    ' ' +
    date.toLocaleTimeString('zh', { hour12: false });
  return (
    <div className="pl-4 pr-2 py-2" style={{ borderTop: BORDER }}>
      <div className="text-lg mb-2">
        <span className="font-bold">{index}F</span>
        <span className="ml-2">{stringHash(ip)}</span>
        <span className="ml-2 text-gray-300">{time}</span>
      </div>
      <div onClick={onClick} className="text-base px-2">
        {content}
      </div>
    </div>
  );
};

interface NovelCommentProps {
  id: string;
  comments: INovelComment[];
  commentRef?: React.RefObject<HTMLDivElement>;
  showInput: boolean;
  onCommentSuccess: () => any;
}

// 打开回复框
const openCommentModal = ({
  novelId,
  reply,
  onCommentSuccess,
}: {
  novelId: string;
  reply?: string;
  onCommentSuccess: () => any;
}) => {
  openModal({
    children: (
      <CommentModal
        onSubmit={async (content) => {
          const res = await pixivNovelNewComment(novelId, content, reply);
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
  comments,
  commentRef,
  showInput,
  onCommentSuccess,
}) => {
  const [commentReverse, setCommentReverse] = useState(true);
  if (commentReverse) {
    comments = [...comments].reverse();
  }
  // 发表评论后滚动到底部
  const endRef = useRef<HTMLDivElement>(null);
  if (!comments) return <></>;
  return (
    <div className="w-full" style={{ borderTop: BORDER }} ref={commentRef}>
      <div className="flex justify-between items-baseline px-4 py-3">
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
          comments.map((comment, index) => {
            return (
              <Comment
                index={commentReverse ? comments.length - index : index + 1}
                {...comment}
                onClick={() => {
                  openCommentModal({
                    novelId: id,
                    reply: comment.id,
                    onCommentSuccess,
                  });
                }}
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
            onCommentSuccess: async () => {
              await onCommentSuccess();
              endRef.current?.scrollIntoView({ behavior: 'smooth' });
            },
          });
        }}
      >
        添加评论
      </div>
    </div>
  );
};

export default NovelComment;
