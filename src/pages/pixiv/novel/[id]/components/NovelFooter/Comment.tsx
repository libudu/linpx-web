import { pixivNovelNewComment } from '@/api';
import { closeModal, openModal } from '@/components/LinpxModal';
import CommentModal from '@/pages/pixiv/novel/[id]/components/NovelFooter/CommentModal';
import { INovelComment } from '@/types';
import { stringHash } from '@/utils/util';
import { Toast } from 'antd-mobile';
import React, { useRef } from 'react';
import { BORDER } from '../..';

// 一条评论
const Comment: React.FC<INovelComment & { index: number }> = ({
  content,
  postTime,
  index,
  ip,
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
      <div className="text-base px-2">{content}</div>
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

const NovelComment: React.FC<NovelCommentProps> = ({
  id,
  comments,
  commentRef,
  showInput,
  onCommentSuccess,
}) => {
  // 发表评论后滚动到底部
  const endRef = useRef<HTMLDivElement>(null);
  if (!comments) return <></>;
  return (
    <div className="w-full" style={{ borderTop: BORDER }} ref={commentRef}>
      <div className="flex justify-between items-baseline px-4 py-3">
        <div className="text-3xl font-black">评论</div>
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
            return <Comment {...comment} index={index + 1} />;
          })
        )}
      </div>
      <div className="h-12 mb-2" ref={endRef} />
      <div
        className="py-3 pl-6 text-gray-400 fixed linpx-width bg-white transition-all duration-500"
        style={{ borderTop: BORDER, bottom: showInput ? 0 : -100 }}
        onClick={() =>
          openModal({
            children: (
              <CommentModal
                onSubmit={async (content) => {
                  const res = await pixivNovelNewComment(id, content);
                  if (res.error) {
                    Toast.info('评论失败', 1.0, undefined, false);
                    return false;
                  } else {
                    Toast.info('评论成功', 1.0, undefined, false);
                    await onCommentSuccess();
                    closeModal();
                    endRef.current?.scrollIntoView({ behavior: 'smooth' });
                    return true;
                  }
                }}
              />
            ),
          })
        }
      >
        添加评论
      </div>
    </div>
  );
};

export default NovelComment;
