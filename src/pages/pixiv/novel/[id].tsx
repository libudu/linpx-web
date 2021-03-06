import { useState, useEffect } from 'react';
import Tag from '@/components/tag';
import { getPixivNovel } from '@/utils/api';

interface INovelInfo {
  id: string;
  title: string;
  userId: string;
  userName: string;
  content: string;
  coverUrl: string;
  tags: string[];
}

export default function PixivNovel(props:any){
  const id = props.match.params.id;
  
  const [novelInfo, setNovelInfo] = useState<INovelInfo>();

  useEffect(()=>{
    getPixivNovel(id).then((res:any)=>{
      if(res?.error) return;
      setNovelInfo(res);
    })
  }, []);

  if(!novelInfo) return null;
  const { title, content, userName, userId, coverUrl, tags } = novelInfo as INovelInfo;
  return (
    <div>
      <div className="py-4 text-center bg-yellow-100 bg-opacity-25 shadow-lg">
        <div className="flex justify-center">
          <img src={coverUrl} className="h-64"></img>
        </div>
        <div className="my-2 mx-10 font-bold text-4xl">
          {title}
        </div>
        <div className="my-2 px-16 text-2xl text-gray-500">
          {userName} {userId}
        </div>
        <div className="text-gray-500 text-lg px-10">
          {tags.map(ele=><Tag key={ele} title={ele}/>)}
        </div>
      </div>

      <div className="whitespace-pre-line p-4">
        {content}
      </div>
    </div>
  );
}
