import { requestPixivNovel, useAnalyseTag, usePixivNovel } from '@/api';
import { TagBoxListModal } from '@/components/TagBox';
import { IAnalyseTag, INovelInfo } from '@/types';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { ContentBox, ContentTitle } from './ContentLayout';

interface INovelFragment {
  novelId: string;
  title: string;
  start: number;
  text: string;
}

const STORAGE_KEY = 'havingSomething';

const getTag = () => {
  return localStorage.getItem(STORAGE_KEY) || '清水';
};

const setTag = (tagName: string) => {
  localStorage.setItem(STORAGE_KEY, tagName);
};

const filterTitle = (title: string) => {
  if (title.startsWith('《') && title.endsWith('》')) {
    return title.slice(1, -1);
  }
  return title;
};

// 随机选取某个标签下某个小说
const getRandomNovelIdFromTag = (tagAnalyseData: IAnalyseTag['data']) => {
  let tag = getTag();
  const novels = tagAnalyseData.find(({ tagName }) => tagName === tag)?.novels;
  if (!novels) {
    return null;
  }
  const novelId = novels[Math.floor(Math.random() * novels.length)];
  return novelId;
};

// 从小说中随机截取一段
const getRandomFragmentFromNovel = (novelInfo: INovelInfo): INovelFragment => {
  const TEXT_AREA_LENGTH = 500;
  const RESULT_LENGTH = 150;
  const { content, title } = novelInfo;
  // 从0到结尾-长度之间选一个开始点
  const start = Math.floor(
    Math.random() * Math.max(content.length - TEXT_AREA_LENGTH, 0),
  );
  const selectText = content.slice(start, start + TEXT_AREA_LENGTH);
  // 找一个当前文章包含的符号作为分隔符
  const splitCharList = ['。', '.'];
  let splitChar = '\n';
  for (let char of splitCharList) {
    if (selectText.split(char).length > 5) {
      splitChar = char;
      break;
    }
  }
  const cleanLineList = selectText.split(splitChar).slice(1, -1);
  let text = '';
  for (let line of cleanLineList) {
    if (text.length > RESULT_LENGTH) break;
    const appendText = line.trimLeft();
    if (appendText) {
      text += appendText + splitChar;
    }
  }
  return {
    text,
    title: filterTitle(title),
    start,
    novelId: novelInfo.id,
  };
};

const useRandomText = () => {
  const tagAnalyseData = useAnalyseTag()?.data || [];
  const [novelFragment, setFragment] = useState<INovelFragment>();
  const refreshText = async () => {
    const novelId = getRandomNovelIdFromTag(tagAnalyseData);
    if (novelId) {
      const novelInfo = await requestPixivNovel(novelId);
      const novelFragment = getRandomFragmentFromNovel(novelInfo);
      setFragment(novelFragment);
      return true;
    }
    return false;
  };
  return {
    novelFragment,
    refreshText,
    tagAnalyseData,
  };
};

const HavingSomething = () => {
  let tag = getTag();
  if (tag === 'r-18') {
    tag = '色色';
  }
  const { novelFragment, refreshText, tagAnalyseData } = useRandomText();
  const { novelId, text, title } = novelFragment || {};
  const [isLoading, setIsLoading] = useState(true);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const refreshTextWithLoading = async () => {
    setIsLoading(true);
    await refreshText();
    setIsLoading(false);
  };
  useEffect(() => {
    refreshTextWithLoading();
  }, [tagAnalyseData]);
  return (
    <>
      <ContentTitle
        left={
          <div>
            随便来点
            <span
              className="underline"
              style={{ textUnderlineOffset: '4px' }}
              onClick={() => setShowSelectModal(true)}
            >
              {tag}
            </span>
          </div>
        }
        right={
          <SyncOutlined
            className="text-xl relative -top-1"
            onClick={refreshTextWithLoading}
          />
        }
      />
      <ContentBox>
        <div
          className="w-full text-base px-3 py-2 whitespace-pre-line relative"
          onClick={() =>
            !isLoading && novelId && history.push(`/pn/${novelId}`)
          }
        >
          <div className=" font-bold text-xl u-line-1">{title}</div>
          {text}
          {isLoading && (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-40" />
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <LoadingOutlined className="text-5xl opacity-80" />
              </div>
            </>
          )}
        </div>
      </ContentBox>
      <TagBoxListModal
        tagList={tagAnalyseData}
        show={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        onClickTag={(tagName) => {
          setTag(tagName);
          refreshTextWithLoading();
          setShowSelectModal(false);
        }}
      />
    </>
  );
};

export default HavingSomething;
