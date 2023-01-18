import { closeInfoModal, openInfoModal } from '../pages/components/Modal';
import ConfuseLinpicioImg from '@/assets/linpicio/Confuse.jpg';
import { registerAppInterceptor } from '.';

const FirstTips: React.FC<{ onConfirm: () => any }> = ({ onConfirm }) => {
  openInfoModal({
    title: 'LINPX提示',
    children: (
      <div className="flex flex-col items-center">
        <img className="w-16 h-16 rounded-md mb-2" src={ConfuseLinpicioImg} />
        <div>本网站可能含有不适合未成年或在工作时段访问的内容</div>
      </div>
    ),
    footer: [{ text: '确认', onPress: () => onConfirm() || closeInfoModal() }],
  });
  return <div />;
};

// 初次使用弹出提示框，防爬虫
const hasJumpConfirm = () => {
  return Boolean(JSON.parse(localStorage.getItem('jumpConfirm') || 'false'));
};
const setJumpConfirm = (state: boolean) => {
  localStorage.setItem('jumpConfirm', JSON.stringify(state));
};

// 第一次访问进行安全提示，避免狗腾讯的爬虫封禁
registerAppInterceptor({
  check: () => !hasJumpConfirm(),
  render: (refresh) => {
    return (
      <FirstTips
        onConfirm={() => {
          refresh();
          setJumpConfirm(true);
        }}
      />
    );
  },
});
