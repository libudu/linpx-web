import { closeInfoModal, openInfoModal } from '../pages/components/Modal';
import ConfuseLinpicioImg from '@/assets/linpicio/Confuse.jpg';

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

export default FirstTips;
