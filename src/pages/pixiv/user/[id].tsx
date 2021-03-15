import { Link, IRouteProps } from 'umi';
import { useState, useEffect } from 'react';
import { getPixivUser, getPixivNovelProfiles, IUserInfo } from '@/utils/api';
import { ContentNavbar } from '@/components/Navbar';
import { history } from 'umi';
import { currDrawerPath } from '@/layouts/DrawerLayout';

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

export default function PixivUser(props: IRouteProps) {
  const id = props.match.params.id;

  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [novels, setNovels] = useState<INovelProfile[]>();
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    getPixivUser(id).then((res: any) => {
      if (res?.error) return props.history.push('/404');
      setUserInfo(res);

      const novels = res.novels.slice().reverse().slice(0, 30);
      getPixivNovelProfiles(novels).then((res: any) => {
        setNovels(res.slice().reverse());
        setFinish(true);
      });
    });
  }, []);

  if (!finish) {
    return (
      <ContentNavbar backTo="/" loading>
        作者详情
      </ContentNavbar>
    );
  }

  const { name, comment, imageUrl, backgroundUrl } = userInfo as IUserInfo;
  const novelEle = (novels as INovelProfile[]).map((ele: INovelProfile) => {
    return (
      <div key={ele.id}>
        <Link to={`/pixiv/novel/${ele.id}`}>{ele.title}</Link>
      </div>
    );
  });

  return (
    <div>
      <ContentNavbar backTo={currDrawerPath}>作者详情</ContentNavbar>
      <div className="text-center pb-4 bg-yellow-100 bg-opacity-25 shadow-lg relative">
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

      <div className="text-center mt-5">{novelEle}</div>
    </div>
  );
}
