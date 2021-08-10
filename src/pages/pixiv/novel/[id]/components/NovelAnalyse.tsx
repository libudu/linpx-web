import React from 'react';
import ReadPng from '@/assets/icon/read.png';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons';

const BORDER = '2px solid #ddd';

const NovelAnalyse: React.FC<{
  readCount: number;
  likeCount: number;
  like: boolean;
  commentCount: number;
  onClickLike: (like: boolean) => any;
  onClickComment: () => any;
}> = ({
  readCount,
  likeCount,
  like,
  commentCount,
  onClickLike,
  onClickComment,
}) => {
  return (
    <div className="h-12 bg-white shadow-md flex">
      <div
        className="flex justify-center items-center"
        style={{ width: '33.3%', borderRight: BORDER }}
      >
        {readCount}
        <img className="w-5 mt-1 ml-2" src={ReadPng} />
      </div>
      <div
        className="flex justify-center items-center"
        style={{ width: '33.4%', borderRight: BORDER }}
        onClick={() => onClickLike(like)}
      >
        {likeCount}
        <LikeOutlined
          className="ml-2 mt-0.5"
          style={{ fontSize: 22, color: like ? 'orange' : 'black' }}
        />
      </div>
      <div
        className="flex justify-center items-center flex-grow text-lg"
        onClick={onClickComment}
      >
        {commentCount}
        <MessageOutlined
          className="ml-2 mt-0.5"
          style={{ fontSize: 22, color: like ? 'orange' : 'black' }}
        />
      </div>
    </div>
  );
};

export default NovelAnalyse;
