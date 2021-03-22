import { useState, useEffect } from 'react';
import { IRouteProps } from 'umi';
import { getPixivNovel, INovelInfo } from '@/utils/api';

import { ContentNavbar } from '@/components/Navbar';
import Tag from '@/components/Tag';

export default function PixivNovel({ match }: IRouteProps) {
  document.title = 'Linpx - 小说详情';
  const id = match.params.id;

  const [novelInfo, setNovelInfo] = useState<INovelInfo>();

  useEffect(() => {
    getPixivNovel(id).then((res: any) => {
      if (res?.error) return;
      setNovelInfo(res);
    });
  }, []);

  if (!novelInfo) {
    return <ContentNavbar>小说详情</ContentNavbar>;
  }

  const { title, content, userName, userId, coverUrl, tags, desc } = novelInfo;

  return (
    <>
      <ContentNavbar backTo={`/pixiv/user/${userId}`}>小说详情</ContentNavbar>
      {novelInfo && (
        <>
          <div className="py-4 pt-20 text-center bg-yellow-100 bg-opacity-25 shadow-lg">
            <div className="flex justify-center">
              <img src={coverUrl} className="h-64 rounded-lg" />
            </div>
            <div className="mt-2 mx-8 font-bold text-3xl">{title}</div>
            <div className="mb-1 px-16 text-2xl text-gray-500">{userName}</div>
            <div className="text-gray-500 text-base px-8">
              {tags.map((ele) => (
                <Tag key={ele} title={ele} />
              ))}
            </div>
            <div
              className="px-8 mt-1 text-base"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </div>
          <div
            className="whitespace-pre-line p-4"
            style={{ pointerEvents: 'none' }}
          >
            {content}
          </div>
          <div className="absolute bottom-0 w-full bg-white">
            <div>{}</div>
            <div></div>
          </div>
        </>
      )}
    </>
  );
}
