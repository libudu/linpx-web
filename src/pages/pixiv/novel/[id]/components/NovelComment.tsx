import { usePixivNovelComments } from '@/api';
import { Array2Map } from '@/types';
import React from 'react';
import { BORDER } from '..';
import hasha from 'hasha';

interface IComment {
  replyComment: IReplyComment | null;
  content: string;
  postTime: number;
  index: number;
  ip: string;
}

type IReplyComment = Omit<IComment, 'replyComment'>;

const Comment: React.FC<IComment> = ({
  content,
  postTime,
  index,
  replyComment,
  ip,
}) => {
  const name = hasha(ip, { algorithm: 'md5' }).slice(0, 8);
  return (
    <div className="pl-4 pr-2 py-2" style={{ borderTop: BORDER }}>
      <div className="text-lg mb-2">
        {index}F {name}
      </div>
      <div className="text-base px-2">{content}</div>
    </div>
  );
};

const NovelComment: React.FC<{ id: string }> = ({ id }) => {
  const data = usePixivNovelComments(id);
  if (!data) return <></>;
  const commentMap = Array2Map(
    data.map((comment, index) => ({ ...comment, index })),
  );
  return (
    <div className="w-full" style={{ borderTop: BORDER }}>
      <div className="flex justify-between items-baseline px-4 py-3">
        <div className="text-3xl font-bold">评论</div>
        <div className="text-base font-bold">最新回复</div>
      </div>
      {data.map(({ id, ip, content, reply, postTime }, index) => {
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
      })}
    </div>
  );
};

export default NovelComment;
