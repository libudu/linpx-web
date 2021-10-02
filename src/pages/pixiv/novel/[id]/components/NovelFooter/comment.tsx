import { getPixivNovelComments, pixivNovelNewComment } from '@/api';
import { closeModal, openModal } from '@/components/LinpxModal';
import { Array2Map, INovelComment } from '@/types';
import { stringHash } from '@/utils/util';
import { Input } from 'antd';
import { Toast } from 'antd-mobile';
import classNames from 'classnames';
import { throttle } from 'lodash';
import React, { useRef, FC, useEffect, useState, useCallback } from 'react';
import { BORDER } from '../..';

const { TextArea } = Input;

let lastCommentText = '';

// 评论模态框
interface CommentModalProps {
  id: string;
  onCommentSuccess: () => any;
}

const CommentModal: FC<CommentModalProps> = ({ id, onCommentSuccess }) => {
  const [text, setText] = useState(lastCommentText);
  // 启动模态框时自动聚焦
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = ref.current as any;
    if (textarea) {
      textarea.focus();
      textarea.resizableTextArea.textArea.setSelectionRange(999, 999);
    }
  }, []);
  // 避免快速输入时出现卡顿
  const onTextChange = useCallback(
    throttle((e: any) => {
      const text = e.target.value;
      setText(text);
      lastCommentText = text;
    }, 200),
    [],
  );
  return (
    <div className="w-full absolute bottom-0 bg-white p-4 pt-3">
      <div className="flex justify-between mb-3 text-2xl items-end">
        <span
          className={classNames('text-gray-400', {
            'text-red-600': text.length >= 1000,
          })}
        >
          {text.length}/1000
        </span>
        <span
          className="bg-yellow-500 py-1 px-2 rounded-md"
          onClick={async () => {
            const res = await pixivNovelNewComment(id, text);
            if (res.error) {
              Toast.info('评论失败', 1.0, undefined, false);
            } else {
              Toast.info('评论成功', 1.0, undefined, false);
              onCommentSuccess();
              lastCommentText = '';
              closeModal();
            }
          }}
        >
          评论
        </span>
      </div>
      <TextArea
        color="yellow"
        autoSize={{ minRows: 2, maxRows: 4 }}
        style={{ fontSize: 24 }}
        ref={ref}
        defaultValue={lastCommentText}
        onChange={onTextChange}
        maxLength={1000}
      />
    </div>
  );
};

interface IComment {
  replyComment: IReplyComment | null;
  content: string;
  postTime: number;
  index: number;
  ip: string;
}

type IReplyComment = Omit<IComment, 'replyComment'>;

// 一条评论
const Comment: React.FC<IComment> = ({
  content,
  postTime,
  index,
  replyComment,
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
  commentRef: React.RefObject<HTMLDivElement>;
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
  const commentMap = Array2Map(
    comments.map((comment, index) => ({ ...comment, index })),
  );
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
          comments.map(({ id, ip, content, reply, postTime }, index) => {
            const replySource = commentMap[reply];
            const replyComment: IReplyComment | null = replySource
              ? {
                  content: replySource.content,
                  postTime: replySource.postTime,
                  index: replySource.index,
                  ip: replySource.ip,
                }
              : null;
            return (
              <Comment
                key={id}
                ip={ip}
                content={content}
                index={index + 1}
                postTime={postTime}
                replyComment={replyComment}
              />
            );
          })
        )}
      </div>
      <div className="h-12 mb-2" ref={endRef} />
      <div
        className="py-3 pl-6 text-gray-400 absolute w-full bg-white transition-all duration-500"
        style={{ borderTop: BORDER, bottom: showInput ? 0 : -100 }}
        onClick={() =>
          openModal({
            children: (
              <CommentModal
                id={id}
                onCommentSuccess={async () => {
                  await onCommentSuccess();
                  endRef.current?.scrollIntoView({ behavior: 'smooth' });
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
