import { IPostComment } from '@/api';
import React from 'react';
import NameTime from './NameTime';

const PostCommentRefer: React.FC<
  IPostComment & { style?: React.CSSProperties }
> = ({ ip, _time, content, floor, style }) => {
  return (
    <div
      className="mx-4 rounded-md px-2 py-1 mt-2 mb-0.5 lp-bgcolor"
      style={{ boxShadow: '0 0 4px #aaa', ...style }}
    >
      <NameTime ip={ip} _time={_time} rightEle={floor + 'F'} />
      <div className="u-line-2">{content}</div>
    </div>
  );
};

export default PostCommentRefer;
