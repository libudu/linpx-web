import { useState, useEffect } from 'react';
import { getPixivNovel } from '@/utils/api';
import { IRouteProps } from 'umi';

import { UnorderedListOutlined } from '@ant-design/icons';

import Navbar from '@/components/navbar';
import Tag from '@/components/tag';

interface INovelInfo {
  id: string;
  title: string;
  userId: string;
  userName: string;
  content: string;
  coverUrl: string;
  tags: string[];
}

export default function PixivNovel({ match, history }: IRouteProps) {
  const id = match.params.id;

  const [novelInfo, setNovelInfo] = useState<INovelInfo>();

  useEffect(() => {
    getPixivNovel(id).then((res: any) => {
      if (res?.error) return;
      setNovelInfo(res);
    });
  }, []);

  if (!novelInfo) return null;
  const {
    title,
    content,
    userName,
    userId,
    coverUrl,
    tags,
  } = novelInfo as INovelInfo;

  const onClickMenu = () => {
    console.log(123);
  };
  const rightEle = (
    <div className="text-4xl" onClick={onClickMenu}>
      <UnorderedListOutlined />
    </div>
  );

  return (
    <>
      <Navbar leftBack={history.length > 1} rightEle={rightEle}>
        小说详情
      </Navbar>

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

      <div className="whitespace-pre-line p-4">{content}</div>
    </>
  );
}
