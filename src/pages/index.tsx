import { history } from 'umi';
import {
  useAnalyseTag,
  useFavUserIds,
  usePixivRecentNovels,
  usePixivUserList,
} from '@/api';
import { IUserInfo } from '@/types';
import { ContentTitle, ContentBox } from './components/ContentLayout';
import TransLink from './components/TransLink';
import { TagBoxList } from '@/components/TagBox';
import UserPreview from './components/UserPreview';
import NovelPreview from './components/NovelPreview';
import HomeBanner from './components/HomeBanner';
import SearchBar from '../components/SearchBar';
import { CloseCircleOutlined } from '@ant-design/icons';

import { useRDF } from './biz/rdf';
import KemonoGameIntro from './biz/kemonoGameIntro';
import HavingSomething from './components/HavingSomething';
import { getAppWidth } from '@/utils/util';
import { useLastReadProgress } from '@/utils/readProgress';
import { FC, useEffect, useState } from 'react';
import { filterTitle } from './pixiv/novel/[id]/util';

let lastUserInfo: IUserInfo[] = Array(8).fill({
  imageUrl: '',
  name: '\n\n',
});

// 首页推荐作者
const FavUserContent: React.FC = () => {
  const favUserIds = useFavUserIds();
  const userInfo =
    usePixivUserList(favUserIds?.slice(0, 8) || []) || lastUserInfo;

  return (
    <>
      <ContentTitle
        left="推荐作者"
        clickRightPath="/pixiv/fav/user"
        clickInfo={
          <div className="text-base">
            <div>推荐一些不错的作者</div>
            <div>主要是兽文作者</div>
            <div>排序每天0点随机刷新一次</div>
            <div>欢迎举荐或自荐作者</div>
            <div>加群反馈：576268549</div>
          </div>
        }
      />
      <ContentBox>
        {userInfo.map((ele, index) => (
          <UserPreview key={ele.id || index} {...ele} />
        ))}
      </ContentBox>
    </>
  );
};

// 首页最近小说
const RecentNovelContent: React.FC = () => {
  // 加载首页小说
  const emptyNovel = {
    title: '\n',
    userName: '\n',
  };

  let novels = usePixivRecentNovels();
  if (!novels || novels.length === 0) novels = Array(8).fill(emptyNovel);

  return (
    <>
      <ContentTitle
        left="最新小说"
        clickRightPath="/pixiv/recent/novels"
        clickInfo={
          <div className="text-base">
            <div>推荐作者按时间线排序的小说</div>
            <div>可以翻到很久很久前的小说</div>
          </div>
        }
      />
      <ContentBox>
        <div className="px-2 flex">
          {novels.map((novel, index) => {
            return (
              <div className="p-2" key={novel.id || index}>
                <NovelPreview {...novel} />
              </div>
            );
          })}
        </div>
      </ContentBox>
    </>
  );
};

const LinpxTagContent: React.FC = () => {
  const analyseTag = useAnalyseTag();
  const tagListData = analyseTag?.data.slice(0, 8) || [];

  return (
    <>
      <ContentTitle
        left="全站tag"
        clickRightPath="/pixiv/tags"
        clickInfo={
          <div className="text-base">
            <div>所有推荐作者的tag统计</div>
            <div>可以按tag快速检索想看的小说</div>
            <div>8点自动更新，存在一定延迟</div>
          </div>
        }
      />
      <TagBoxList
        tagList={tagListData}
        onClickTag={(tagName) => history.push(`/pixiv/tag?tagName=${tagName}`)}
      />
    </>
  );
};

const TransLinkContent: React.FC = () => {
  return (
    <>
      <ContentTitle
        left="生成LINPX链接"
        rightText=""
        clickInfo={
          <div className="text-base">
            <div>将pixiv链接转为linpx</div>
            <div>从而不需要翻墙、登录，点开即阅</div>
            <br />
            <div>当前支持作者和小说两种格式链接</div>
            <div className="text-left">
              <div>作者举例：https://www.pixiv.net/users/32809296</div>
              <div>
                小说举例：https://www.pixiv.net/novel/show.php?id=14198407
              </div>
            </div>
          </div>
        }
      />
      <ContentBox>
        <TransLink />
      </ContentBox>
    </>
  );
};

const FriendlyLinks = () => {
  return (
    <>
      <ContentTitle left="友情链接" rightText="" />
      <ContentBox>
        <KemonoGameIntro />
      </ContentBox>
    </>
  );
};

const ContinueReading: FC = () => {
  const SHOW_SECOND = 5;
  const FADE_SECOND = 3;

  const [show, setShow] = useState(true);
  const readProgress = useLastReadProgress();
  // 渐隐、去除
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, SHOW_SECOND * 1000);
  }, []);
  useEffect(() => {
    if (readProgress) {
      setTimeout(() => {
        readProgress.clearReadProgress();
      }, (SHOW_SECOND + FADE_SECOND) * 1000);
    }
  }, [readProgress]);
  if (!readProgress) {
    return <></>;
  }
  const { pos, novel, clearReadProgress } = readProgress;
  return (
    <div
      className="bg-yellow-200 fixed bottom-0 py-2 px-4 flex justify-between items-center"
      style={{
        width: getAppWidth(),
        opacity: show ? 1 : 0,
        transition: `all ${FADE_SECOND}s`,
      }}
    >
      <div
        className="u-line-1"
        onClick={() => history.push(readProgress.path + `?pos=${pos}`)}
      >
        <span className="font-bold">继续阅读</span> 《{filterTitle(novel.title)}
        》
      </div>
      <CloseCircleOutlined
        style={{
          position: 'relative',
          top: '1px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          clearReadProgress();
        }}
      />
    </div>
  );
};

const IndexPage = () => {
  document.title = 'Linpx - 首页';

  useRDF();

  return (
    <div className="relative">
      <HomeBanner />
      <div className="px-6 pb-6">
        <SearchBar onSearch={(word) => history.push(`/search?word=${word}`)} />
        <FavUserContent />
        <RecentNovelContent />
        <HavingSomething />
        <LinpxTagContent />
        {/* <TransLinkContent /> */}
        <FriendlyLinks />
      </div>
      <ContinueReading />
    </div>
  );
};

export default IndexPage;
