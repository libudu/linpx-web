import { useEffect, useState } from 'react';
import NovelCardList from '@/components/NovelCardList';
import { _setRightEle } from '@/layouts/DrawerLayout';
import DeleteImg from '@/assets/icon/delete.png';
import { closeInfoModal, openInfoModal } from './components/Modal';

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

const clearHistory = () => {
  localStorage.setItem(HISTORY_KEY, '[]');
};

const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const refreshHistory = () => setHistory(getHistory());
  useEffect(() => {
    refreshHistory();
  }, []);
  return { history, refreshHistory };
};

const ClearHistoryIcon: React.FC<{ onClear: () => any }> = ({ onClear }) => {
  return (
    <img
      className="ml-2 w-9"
      onClick={() => {
        openInfoModal({
          title: '确认清空所有阅读历史吗',
          children: undefined,
          footer: [
            { text: '返回', onPress: closeInfoModal },
            {
              text: '确认',
              onPress: () => {
                // 清空历史记录
                clearHistory();
                // 触发UI重绘
                onClear();
                closeInfoModal();
              },
            },
          ],
        });
      }}
      src={DeleteImg}
    />
  );
};

const History = () => {
  const { history, refreshHistory } = useHistory();
  useEffect(() => {
    _setRightEle(<ClearHistoryIcon onClear={refreshHistory} />);
    return () => _setRightEle(undefined);
  }, []);
  return (
    <div className="mx-6">
      <NovelCardList novelIdList={history.map((item) => item.id)} />
    </div>
  );
};

export default History;
