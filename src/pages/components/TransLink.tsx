import { InputItem } from 'antd-mobile';
import { copyTextAndToast } from '@/utils/clipboard';

function Box({ children }: { children: any }) {
  return (
    <div
      className="lp-shadow bg-white h-10 my-4 pl-2 text-xl flex items-center overflow-hidden"
      style={{ borderRadius: '9999px' }}
      children={children}
    />
  );
}

export default function TransLink() {
  const pasteTip = <div className="text-gray-300 ml-6">粘贴Pixiv链接</div>;
  return (
    <div className="py-2 px-6 w-full">
      <Box>
        <InputItem className="w-full" clear placeholder="粘贴 LINPX 链接" />
      </Box>

      <Box>
        <div className="w-full flex">
          <div style={{ width: '70%' }}>
            <InputItem editable={false} clear placeholder="LINPX 链接" />
          </div>
          <div
            className="flex justify-center items-center bg-yellow-400 text-white font-bold"
            style={{ width: '30%' }}
            onClick={() => copyTextAndToast('114514')}
          >
            复制
          </div>
        </div>
      </Box>
    </div>
  );
}
