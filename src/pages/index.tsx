import { history } from 'umi';
import {
  getRecommendPixivAuthors,
  getPixivUserList,
  getRecentNovels,
  IUserInfo,
  INovelProfile,
} from '@/utils/api';
import { useEffect, useState } from 'react';
import { ContentTitle, ContentBox } from './components/ContentLayout';
import TransLink from './components/TransLink';
import { Modal } from 'antd-mobile';

interface IBox {
  name: string;
  path: string;
  children?: any;
}

function UserCard({ id, imageUrl, name }: IUserInfo) {
  const [isHeight, setIsHeight] = useState<boolean>(false);

  const onImgLoad = (res: any) => {
    const ele = res.target;
    setIsHeight(ele.naturalHeight > ele.naturalWidth);
  };

  return (
    <div
      key={id}
      className="w-24 p-2 pt-4"
      onClick={() => history.push(`/pixiv/user/${id}`)}
    >
      <div
        className="rounded-full overflow-hidden flex justify-center items-center"
        style={{
          width: '4.5rem',
          height: '4.5rem',
        }}
      >
        <img
          style={isHeight ? { width: '100%' } : { height: '100%' }}
          src={imageUrl}
          loading="lazy"
          onLoad={onImgLoad}
        />
      </div>
      <div
        className="text-sm mt-1 text-center u-line-2"
        style={{ wordWrap: 'break-word' }}
      >
        {name}
      </div>
    </div>
  );
}

function NovelCard({ coverUrl, title, id, userName }: INovelProfile) {
  return (
    <div
      className="lp-shadow m-2 text-sm flex-grow-0 flex-shrink-0 overflow-hidden"
      style={{ width: '6.5rem', wordBreak: 'keep-all' }}
      onClick={() => id && history.push(`/pixiv/novel/${id}`)}
    >
      {coverUrl ? (
        <div className="h-24 w-full overflow-hidden flex items-center">
          <img className="w-full" src={coverUrl} loading="lazy" />
        </div>
      ) : (
        <div className="h-24 w-full bg-gray-200" />
      )}
      <div className="u-line-2 m-1 mb-0 text-center font-bold text-sm">
        {title}
      </div>
      <div className="u-line-1 m-1 mt-0 text-center text-xs">{userName}</div>
    </div>
  );
}

let lastUserInfo: IUserInfo[] = [];
const initRDF =
  String(history.location.query?.from).toLocaleLowerCase() === 'rdf';

export default function IndexPage() {
  document.title = 'Linpx - 首页';
  const [showRDF, setShowRDF] = useState(initRDF);

  const [userInfo, setUserInfo] = useState<IUserInfo[]>(lastUserInfo);
  useEffect(() => {
    getRecommendPixivAuthors().then((res) => {
      // 只取前十个作为随机推荐作者
      getPixivUserList((res as string[]).slice(0, 8)).then((res) => {
        lastUserInfo = res;
        setUserInfo(res);
      });
    });
  }, []);

  const [novelsInfo, setNovelsInfo] = useState<INovelProfile[]>([]);
  useEffect(() => {
    getRecentNovels().then((res) => {
      setNovelsInfo(res);
    });
  }, []);

  return (
    <>
      <div className="lp-bgcolor h-40 flex flex-col justify-center items-center font-bold text-3xl">
        <div>是的！</div>
        <div>还没做完！</div>
      </div>
      <Modal
        visible={showRDF}
        transparent
        maskClosable={false}
        title="红龙基金新人礼"
        footer={[{ text: '确认', onPress: () => setShowRDF(false) }]}
      >
        <div className="text-base">
          <div>礼品兑换码</div>
          <div>I8HLK-DQWR3-QJ404</div>
          <div>BQD0H-JBBCM-FALVH</div>
          <div>G69FV-WIIP7-EX9JQ</div>
        </div>
      </Modal>
      <div className="px-6 pb-6">
        <ContentTitle left="作者推荐" clickRightPath="/pixiv/recommend/users" />
        <ContentBox
          children={lastUserInfo.map((ele) => (
            <UserCard key={ele.id} {...ele} />
          ))}
        />
        <ContentTitle left="最新小说" clickRightPath="/pixiv/recent/novels" />
        <ContentBox
          className="px-2"
          children={novelsInfo.map((novel) => (
            <NovelCard key={novel.id} {...novel} />
          ))}
        />
        <ContentTitle left="生成LINPX链接" right="" />
        <ContentBox children={TransLink()} />
      </div>
    </>
  );
}
