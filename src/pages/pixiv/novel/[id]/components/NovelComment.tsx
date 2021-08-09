import { usePixivNovelComments } from '@/api';
import { Array2Map } from '@/types';
import { stringHash } from '@/utils/util';
import React from 'react';
import { BORDER } from '..';

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

const NovelComment: React.FC<{ id: string }> = ({ id }) => {
  const data = usePixivNovelComments(id, true);
  if (!data) return <></>;
  const commentMap = Array2Map(
    data.map((comment, index) => ({ ...comment, index })),
  );
  return (
    <div className="w-full" style={{ borderTop: BORDER }}>
      <div className="flex justify-between items-baseline px-4 py-3">
        <div className="text-3xl font-black">评论</div>
        <div className="text-base font-black">最新回复</div>
      </div>
      <div className="w-full">
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
    </div>
  );
};

export default NovelComment;
