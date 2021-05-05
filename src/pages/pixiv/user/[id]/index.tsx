import { IRouteProps, history } from 'umi';
import { useState, useEffect } from 'react';
import { getPixivUser, IUserInfo } from '@/utils/api';
import { ContentNavbar } from '@/components/Navbar';
import { TagBoxList, TagBoxListModal } from '@/components/TagBox';
import NovelCardList from '@/components/NovelCardList';
import PageLayout from '@/components/PageLayout';

function UserPart({
  name,
  id,
  comment,
  imageUrl,
  backgroundUrl,
  tags,
}: IUserInfo) {
  const [showModal, setShowModal] = useState(false);
  const tagListData = Object.entries(tags).map(([tagName, time]) => ({
    tagName,
    time,
  }));

  return (
    <div className="text-center pb-4 bg-yellow-100 bg-opacity-25 shadow-lg relative">
      <TagBoxListModal
        tagList={tagListData}
        show={showModal}
        onClose={() => setShowModal(false)}
        onClickTag={(tagName) => {
          history.push(`/pixiv/user/${id}/tag/${tagName}`);
        }}
      />
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

      <div className="mx-8 mr-6 my-2">
        <TagBoxList
          tagList={tagListData.slice(0, 7)}
          showTotalButton={tagListData.length > 7}
          clickShowTotal={() => setShowModal(true)}
          onClickTag={(tagName) => {
            history.push(`/pixiv/user/${id}/tag/${tagName}`);
          }}
        />
      </div>
    </div>
  );
}

export default function PixivUser(props: IRouteProps) {
  document.title = 'Linpx - 作者详情';

  const id = props.match.params.id;

  const [userInfo, setUserInfo] = useState<IUserInfo>();

  useEffect(() => {
    getPixivUser(id).then((userInfo) => {
      // @ts-ignore
      if (!userInfo) return props.history.push('/404');
      setUserInfo(userInfo);
    });
  }, []);

  if (!userInfo) {
    return <ContentNavbar backTo="/">作者详情</ContentNavbar>;
  }
  return (
    <PageLayout title="作者详情">
      <UserPart {...userInfo} />
      <div className="mx-6">
        <NovelCardList novelIdList={userInfo.novels.slice().reverse()} />
      </div>
    </PageLayout>
  );
}
