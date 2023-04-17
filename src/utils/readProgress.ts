// 继续上次游览的长篇小数阅读
// 核心：控制影响范围，只有在长篇小说、看到中间的时候才触发

import { usePixivNovelProfiles } from '@/api';
import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

// 在小说阅读界面记录当前翻阅进度
interface IReadProgress {
  path: string;
  pos: number;
  total: number;
  id: string;
}

const READ_PROGRESS_KEY = 'readProgress';

export const recordReadProgress = throttle((readProgress: IReadProgress) => {
  localStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(readProgress));
}, 1000);

const getReadProgress = (): IReadProgress | null => {
  const readProgressStr = localStorage.getItem(READ_PROGRESS_KEY);
  if (readProgressStr) {
    return JSON.parse(readProgressStr);
  }
  return null;
};

// 字数和pos的关系大概在1.5~2.0之间，没有排除简介误差
// 对于较长的小说，游览过了开头后且不贴近结尾才算作上次游览记录

// 至少7500字，至多10000字以上才记录
const MIN_RECORD_LENGTH = 10000 * 1.5;
// 上下1000长度的缓冲
const MIN_RECORD_BUFFER_LENGTH = 1000;
const checkReadProgress = () => {
  const readProgress = getReadProgress();
  if (readProgress) {
    const { total, pos } = readProgress;
    if (
      total > MIN_RECORD_LENGTH &&
      pos > MIN_RECORD_BUFFER_LENGTH &&
      pos < total - MIN_RECORD_BUFFER_LENGTH
    ) {
      return readProgress;
    }
  }
  return null;
};

export const useLastReadProgress = () => {
  const [readProgress, setReadProgress] = useState<IReadProgress>();
  const novelProfile = usePixivNovelProfiles(
    readProgress ? [readProgress.id] : [],
  )?.[0];
  useEffect(() => {
    setReadProgress(checkReadProgress() || undefined);
  }, []);
  if (!readProgress || !novelProfile) {
    return undefined;
  }
  return {
    ...readProgress,
    novel: novelProfile,
    clearReadProgress: () => {
      localStorage.removeItem(READ_PROGRESS_KEY);
      setReadProgress(undefined);
    },
  };
};
