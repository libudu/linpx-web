import LinpxNovelWidget from './LinpxNovelWidget';

export const introLinpxNovelText = `【标签 开始】
今天天气真好呀，出去走走吧。
你决定去哪玩呢？
【选项】超市【跳转标签 去超市】
【选项】公园【跳转标签 去公园】

【标签 去超市】
你去超市买了好多吃的，很开心。
一天结束了。
【结束】

【标签 去公园】
你去公园玩，碰到了很多猫猫狗狗，很开心。
你碰到了一只头上顶着一片叶子的神奇的橘猫，他说能让你回到今天刚开始的时候。
你的反应是：
【选项】好呀，让今天重新开始吧【跳转标签 重新开始】
【选项】置之不理
你没有理橘猫，橘猫识相地走开了。
【结束】

【标签 重新开始】
【清空】
【跳转标签 开始】
`;

const HomeIntro: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="text-xl flex font-black text-center mb-1">
        <div className="mr-6 flex-grow">范例</div>
        <div className="flex-grow">原文</div>
      </div>
      <div className="flex h-60 whitespace-pre-line text-base py-1">
        <div
          className="w-1/2 overflow-scroll rounded-xl px-2 py-1 mr-6"
          style={{ boxShadow: '0 0 6px #888' }}
        >
          <LinpxNovelWidget style={{ zoom: 0.7 }} text={introLinpxNovelText} />
        </div>
        <div
          className="w-1/2 overflow-scroll rounded-xl px-2 py-1 leading-4"
          style={{ boxShadow: '0 0 6px #888' }}
        >
          <div style={{ zoom: 0.7 }}>{introLinpxNovelText}</div>
        </div>
      </div>
      {/* <div className="text-base">
        Linpx-Novel是一个增量的，声明式的，用于为小说添加简单动效、选项分支和流程控制的文本格式。
      </div>
      <div>
        在已有的小说文本中添加一些简单的、中文的标签即可实现上述效果。整体类似于简易中文版的inky。
      </div> */}
    </div>
  );
};

export default HomeIntro;
