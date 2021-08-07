import { IRouteProps, history } from 'umi';
import { useState } from 'react';
import { usePixivUser, useFavUserById } from '@/api';
import { IUserInfo } from '@/types';
import { ContentNavbar } from '@/components/Navbar';
import { TagBoxList, TagBoxListModal } from '@/components/TagBox';
import NovelCardList from '@/components/NovelCardList';
import PageLayout from '@/components/PageLayout';

import DefaultBgImg from '@/assets/default/default_bg.jpg';
import AfdianImg from '@/assets/icon/afdian.png';
import { openAfdianUrl } from '@/pages/components/Afdian';

const MaxUserComment = 50;

function UserPart({
  name,
  id,
  comment,
  imageUrl,
  backgroundUrl,
  tags,
}: IUserInfo) {
  // 全部的tag模态框
  const [showModal, setShowModal] = useState(false);
  // 是否是推荐作者
  const favUserInfo = useFavUserById(id);
  const afdianUrl = favUserInfo?.afdian;
  // 过长的自我介绍
  let isLongComment = false;
  if (comment.length > MaxUserComment) isLongComment = true;
  const [allComment, setAllComment] = useState(false);

  const tagListData = Object.entries(tags).map(([tagName, time]) => ({
    tagName,
    time,
  }));

  return (
    <div
      className="text-center pb-4 shadow-lg relative"
      style={{ backgroundColor: 'rgb(255,252,241)' }}
    >
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
        style={{ backgroundImage: `url(${backgroundUrl || DefaultBgImg})` }}
      />
      {/* 头像、名字、id */}
      <div className="mx-4 flex pt-12">
        <div
          className="h-32 w-32 z-10 mt-2 bg-center rounded-full flex-shrink-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            border: '8px solid rgb(255,252,241)',
          }}
        />
        <div className="z-10 mt-16 pb-2 mr-1 flex items-center">
          <div className="text-left mt-1" style={{ height: 'max-content' }}>
            <div
              className="mb-1 font-bold text-left align-text-bottom"
              style={{ fontSize: '1.25rem' }}
            >
              {name}
            </div>
            <div className="flex">
              <div
                className="mr-2 px-1.5 py-0.5 text-sm bg-blue-400 text-white rounded-lg"
                style={{ width: 'max-content' }}
                onClick={() => window.open(`https://www.pixiv.net/users/${id}`)}
              >
                PID:{id}
              </div>
              {afdianUrl && (
                <div
                  className="px-2 py-0.5 text-sm bg-purple-500 text-white rounded-lg flex items-center"
                  style={{ width: 'max-content' }}
                  onClick={() => openAfdianUrl(name, afdianUrl)}
                >
                  <img src={AfdianImg} style={{ height: 16, marginRight: 3 }} />
                  <span>支持作者</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 简介、标签 */}
      <div
        className="mx-4 whitespace-pre-line"
        style={{ fontSize: '16px', lineHeight: '30px' }}
      >
        {allComment ? comment : comment.slice(0, MaxUserComment)}
        <span
          className="text-gray-400 border-gray-400 ml-2"
          style={{ borderBottom: '1px solid' }}
          onClick={() => setAllComment(!allComment)}
        >
          {isLongComment && (allComment ? '收起全部' : '查看全部')}
        </span>
      </div>
      <div className="m-2">
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

  const userInfo = usePixivUser(id);

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
