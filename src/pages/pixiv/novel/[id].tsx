import { useState, useEffect } from 'react';
import { IRouteProps } from 'umi';
import { getPixivNovel } from '@/utils/api';

import { ContentNavbar } from '@/components/Navbar';
import Tag from '@/components/Tag';

interface INovelInfo {
  id: string;
  title: string;
  userId: string;
  userName: string;
  content: string;
  coverUrl: string;
  tags: string[];
}

export default function PixivNovel({ match }: IRouteProps) {
  const id = match.params.id;

  const [novelInfo, setNovelInfo] = useState<INovelInfo>();

  useEffect(() => {
    getPixivNovel(id).then((res: any) => {
      if (res?.error) return;
      setNovelInfo(res);
    });
  }, []);

  if (!novelInfo) {
    return <ContentNavbar loading>小说详情</ContentNavbar>;
  }

  const { title, content, userName, userId, coverUrl, tags } = novelInfo;

  return (
    <>
      <ContentNavbar backTo={`/pixiv/user/${userId}`}>小说详情</ContentNavbar>
      {novelInfo && (
        <>
          <div className="py-4 text-center bg-yellow-100 bg-opacity-25 shadow-lg">
            <div className="flex justify-center">
              <img src={coverUrl} className="h-64 rounded-lg" />
            </div>
            <div className="my-2 mx-8 font-bold text-3xl">{title}</div>
            <div className="my-2 px-16 text-2xl text-gray-500">{userName}</div>
            <div className="text-gray-500 text-lg px-8">
              {tags.map((ele) => (
                <Tag key={ele} title={ele} />
              ))}
            </div>
          </div>
          <div className="whitespace-pre-line p-4">{content}</div>)
        </>
      )}
    </>
  );
}
