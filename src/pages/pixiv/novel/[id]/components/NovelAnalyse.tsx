import React from 'react';
import ReadPng from '@/assets/icon/read.png';
import { LikeOutlined } from '@ant-design/icons';

const NovelAnalyse: React.FC<{
  readCount: number;
  likeCount: number;
  like: boolean;
  onClickLike: (like: boolean) => any;
}> = ({ readCount, likeCount, like, onClickLike }) => {
  return (
    <div className="h-12 bg-white shadow-md flex">
      <div
        className="flex justify-center items-center"
        style={{ width: '50%', borderRight: '2px solid #ddd' }}
      >
        {readCount}
        <img className="w-5 mt-1 ml-2" src={ReadPng} />
      </div>
      <div
        className="flex justify-center items-center"
        style={{ width: '50%' }}
        onClick={() => onClickLike(like)}
      >
        {likeCount}
        <LikeOutlined
          className="ml-2 mt-0.5"
          style={{ fontSize: 22, color: like ? 'orange' : 'black' }}
        />
      </div>
    </div>
  );
};

export default NovelAnalyse;
