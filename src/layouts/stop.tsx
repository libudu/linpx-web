import { useEffect } from 'react';
import { registerAppInterceptor } from '.';
import { openInfoModal } from '../pages/components/Modal';

const STOP_START_TIME = '2022-12-6 1:1:1';
const STOP_END_TIME = '2022-12-6 11:11:11';

const checkStop = () => {
  const start = new Date(STOP_START_TIME);
  const end = new Date(STOP_END_TIME);
  const now = new Date();
  if (
    location.host == 'linpx.linpicio.com' ||
    location.host == 'furrynovel.xyz'
  ) {
    if (now > start && now < end) {
      return true;
    }
  }
  return false;
};

const openStopModal = () => {
  openInfoModal({
    title: (
      <>
        <div>《林匹克斯》12月6日</div>
        <div>维护通知</div>
      </>
    ),
    children: (
      <div className="text-sm text-left">
        <div>亲爱的猫狗狼熊狐獭龙们，</div>
        <div className="mt-2"></div>
        <div>
          自12月6日01:01:01起《林匹克斯》将进行临时维护，维护期间无法正常浏览网页，预计12月6日11:11:11后恢复。
        </div>
        <div className="mt-2"></div>
        <div>爱是最伟大的魔法🕯️</div>
        <div className="mt-2"></div>
        <div>《林匹克斯》官方运营猫</div>
        <div>2022年12月5日</div>
      </div>
    ),
  });
};

const Stop = () => {
  useEffect(() => {
    openStopModal();
  }, []);
  return <div />;
};

registerAppInterceptor({
  check: checkStop,
  render: () => <Stop />,
});
