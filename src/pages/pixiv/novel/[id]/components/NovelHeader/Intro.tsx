import Tag from '@/components/Tag';
import { INovelInfo } from '@/types';
import React from 'react';
import { history } from 'umi';
import { checkLinpxNovel } from '@/pages/pixiv/novel/[id]/util';
import InteractImg from '@/assets/icon/interact.png';

// 处理小说简介中的desc
export const processNovelDesc = (desc: string) => {
  return decodeURIComponent(desc).replaceAll('/jump.php?', '');
};

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
  const isLinpxNovel = checkLinpxNovel({ desc });
  return (
    <div className="py-4 pt-20 w-full text-center bg-yellow-100 bg-opacity-25 shadow-md relative z-20">
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
      <div className="mt-2 mx-8 font-black text-3xl">
        {title}
        {isLinpxNovel && <img className="w-7 mb-1.5" src={InteractImg} />}
      </div>
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
        dangerouslySetInnerHTML={{ __html: processNovelDesc(desc) }}
      />
    </div>
  );
};

export default NovelIntro;
