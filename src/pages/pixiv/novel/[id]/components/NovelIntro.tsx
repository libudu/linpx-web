import Tag from '@/components/Tag';
import { INovelInfo } from '@/types';
import React from 'react';
import { history } from 'umi';

const NovelIntro: React.FC<INovelInfo> = ({
  coverUrl,
  title,
  userName,
  content,
  createDate,
  userId,
  tags,
  desc,
}) => {
  return (
    <div className="py-4 pt-20 text-center bg-yellow-100 bg-opacity-25 shadow-lg relative z-10">
      <div className="flex justify-center">
        <img src={coverUrl} className="h-64 rounded-lg" />
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
  );
};

export default NovelIntro;
