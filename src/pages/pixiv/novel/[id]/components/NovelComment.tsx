import React from 'react';
import { BORDER } from '..';

const Comment: React.FC = () => {
  return (
    <div className="pl-4 pr-2 py-2" style={{ borderTop: BORDER }}>
      <div className="text-lg mb-2">1F ABCDEF</div>
      <div className="text-base px-2">
        好活，就是有点烂，栏中不足就是太好了没有体现出烂
      </div>
    </div>
  );
};

const NovelComment: React.FC<{ id: string }> = () => {
  return (
    <div className="w-full" style={{ borderTop: BORDER }}>
      <div className="flex justify-between items-baseline px-4 py-3">
        <div className="text-3xl font-bold">评论</div>
        <div className="text-base font-bold">最新回复</div>
      </div>
      <Comment />
    </div>
  );
};

export default NovelComment;
