import { IRouteProps, history } from 'umi';
import { useState, useEffect } from 'react';
import { getPixivUser, getPixivNovelProfiles, IUserInfo } from '@/utils/api';
import { ContentNavbar } from '@/components/Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';
import NovelCard from '@/components/NovelCard';

// 小说简介
interface INovelProfile {
  id: string;
  title: string;
  coverUrl: string;
  tags: string[];
  userId: string;
  userName: string;
  desc: string;
}

function UserCard({ name, id, comment, imageUrl, backgroundUrl }: IUserInfo) {
  return (
    <div className="text-center pt-10 pb-4 bg-yellow-100 bg-opacity-25 shadow-lg relative">
      <div
        className="w-full h-28 bg-center absolute"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="flex justify-center pt-10 rounded-full">
        <div
          style={{ backgroundImage: `url(${imageUrl})` }}
          className="h-36 w-36 rounded-full z-10 border-solid border-8 border-yellow-100 bg-center"
        />
      </div>
      <div className="my-2 mx-10 font-bold text-4xl">{name}</div>

      <div className="my-2 px-16 text-lg text-blue-400">Pixiv id: {id}</div>

      <div className="whitespace-pre-line text-lg px-12">{comment}</div>
    </div>
  );
}

export default function PixivUser(props: IRouteProps) {
  document.title = 'Linpx - 作者详情';
  const id = props.match.params.id;

  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [novels, setNovels] = useState<INovelProfile[]>();

  useEffect(() => {
    getPixivUser(id).then((res: any) => {
      if (res?.error) return props.history.push('/404');
      setUserInfo(res);

      const novels = res.novels.slice().reverse().slice(0, 20);
      getPixivNovelProfiles(novels).then((res) => {
        console.log(res);
        setNovels(res.slice().reverse());
      });
    });
  }, []);

  if (!userInfo || !novels) {
    return <ContentNavbar backTo="/">作者详情</ContentNavbar>;
  }

  return (
    <>
      <ContentNavbar backTo={currDrawerPath}>作者详情</ContentNavbar>
      <UserCard {...userInfo} />
      <div className="text-center m-6">
        {novels.map((ele: INovelProfile) => (
          <div key={ele.id}>
            <NovelCard {...ele} />
          </div>
        ))}
      </div>
    </>
  );
}
