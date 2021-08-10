import { usePixivNovelComments } from '@/api';
import { openModal } from '@/components/LinpxModal';
import { Array2Map } from '@/types';
import { stringHash } from '@/utils/util';
import { Input } from 'antd';
import React, { useRef, FC, useEffect, useState } from 'react';
import { BORDER } from '..';

const { TextArea } = Input;

let lastCommentText = '';

// 评论模态框
const CommentModal: FC = () => {
  const [text, setText] = useState(lastCommentText);
  // 启动模态框时自动聚焦
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = ref.current as any;
    if (textarea) {
      textarea.focus();
      console.log(textarea);
      textarea.resizableTextArea.textArea.setSelectionRange(999, 999);
    }
  }, []);
  return (
    <div className="w-full absolute bottom-0 bg-white p-4">
      <div className="flex justify-between">
        <span>{text.length}/1000</span>
        <span>评论</span>
      </div>
      <TextArea
        autoSize={{ minRows: 2, maxRows: 4 }}
        style={{ fontSize: 24 }}
        ref={ref}
        defaultValue={lastCommentText}
        onChange={(e) => {
          const text = e.target.value;
          setText(text);
          lastCommentText = text;
        }}
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

interface INovelComment {
  id: string;
  commentRef: React.RefObject<HTMLDivElement>;
  showInput: boolean;
}

const NovelComment: React.FC<INovelComment> = ({
  id,
  commentRef,
  showInput,
}) => {
  const data = usePixivNovelComments(id, true);
  if (!data) return <></>;
  const commentMap = Array2Map(
    data.map((comment, index) => ({ ...comment, index })),
  );
  return (
    <div className="w-full" style={{ borderTop: BORDER }} ref={commentRef}>
      <div className="flex justify-between items-baseline px-4 py-3">
        <div className="text-3xl font-black">评论</div>
        <div className="text-base font-black">最新回复</div>
      </div>
      <div className="w-full">
        {data.length === 0 ? (
          <div
            className="h-32 flex justify-center items-center text-gray-400"
            style={{ borderTop: BORDER }}
          >
            快来添加第一条评论吧
          </div>
        ) : (
          data.map(({ id, ip, content, reply, postTime }, index) => {
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
      <div className="h-10" />
      <div
        className="py-3 pl-6 text-gray-400 absolute w-full bg-white transition-all duration-500"
        style={{ borderTop: BORDER, bottom: showInput ? 0 : -100 }}
        onClick={() =>
          openModal({
            children: <CommentModal />,
          })
        }
      >
        添加评论
      </div>
    </div>
  );
};

export default NovelComment;
