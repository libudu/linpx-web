import { useEffect, useState } from 'react';
import NovelCardList from '@/components/NovelCardList';

const HISTORY_KEY = 'history';
const MAX_HISTORY_COUNT = 100;

interface HistoryItem {
  type: 'pn';
  id: string;
  time: number;
}

export const pushHistory = (item: HistoryItem) => {
  const historyList = getHistory();
  // 已存在记录，去除旧的，unshift新的
  const index = historyList.findIndex(
    (historyItem) => historyItem.id === item.id,
  );
  if (index != -1) {
    historyList.splice(index, 1);
  }
  historyList.unshift(item);
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(historyList.slice(0, MAX_HISTORY_COUNT)),
  );
};

const getHistory = (): HistoryItem[] => {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
};

const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    setHistory(getHistory());
  }, []);
  return history;
};

const History = () => {
  const history = useHistory();
  return (
    <div className="mx-6">
      <NovelCardList novelIdList={history.map((item) => item.id)} />
    </div>
  );
};

export default History;
