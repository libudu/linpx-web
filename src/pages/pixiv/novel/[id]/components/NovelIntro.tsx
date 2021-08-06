import Tag from '@/components/Tag';
import { INovelInfo } from '@/types';
import React from 'react';
import { history } from 'umi';
import ReadPng from '@/assets/icon/read.png';
import { LikeOutlined } from '@ant-design/icons';

const NovelIntro: React.FC<INovelInfo> = ({
  coverUrl,
  title,
  userName,
  content,
  createDate,
  userId,
  tags,
  desc,
  pixivLikeCount,
  pixivReadCount,
}) => {
  return (
    <>
      <div className="py-4 pt-20 w-full text-center bg-yellow-100 bg-opacity-25 shadow-md relative z-10">
        <div className="flex justify-center w-full">
          <img
            className="rounded-lg object-cover"
            style={{
              maxWidth: '70%',
              height: '220px',
            }}
            src={coverUrl}
          />
        </div>
        <div className="mt-2 mx-8 font-bold text-3xl">{title}</div>
        <div
          className="px-16 text-2xl text-gray-500 underline"
          onClick={() => history.push(`/pixiv/user/${userId}`)}
        >
          {userName}
        </div>
        <div className="mb-1 text-base text-gray-500">
          <span>{content.length}字</span>
          <span className="ml-4">{new Date(createDate).toLocaleString()}</span>
        </div>
        <div className="text-gray-500 text-base px-8">
          {tags.map((ele) => (
            <Tag key={ele} children={ele} />
          ))}
        </div>
        <div
          className="px-8 mt-1 text-base"
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      </div>
      <div className="h-12 bg-white shadow-md flex">
        <div
          className="flex justify-center items-center"
          style={{ width: '50%', borderRight: '2px solid #ddd' }}
        >
          {pixivReadCount}
          <img className="w-5 mt-1 ml-2" src={ReadPng} />
        </div>
        <div
          className="flex justify-center items-center"
          style={{ width: '50%' }}
        >
          {pixivLikeCount}
          <LikeOutlined className="ml-2 mt-0.5" style={{ fontSize: 22 }} />
        </div>
      </div>
    </>
  );
};

export default NovelIntro;
