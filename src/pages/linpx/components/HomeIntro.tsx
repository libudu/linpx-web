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
    <div className="text-base">
      <div>
        Linpx-Novel是一个增量的，声明式的，用于为小说添加简单动效、选项分支和流程控制的文本格式。
      </div>
      <div>
        在已有的小说文本中添加一些简单的、中文的标签即可实现上述效果。整体类似于简易中文版的inky。
      </div>
      <div>下面是一个简单示例：</div>
      <div className="bg-gray-300 rounded-lg px-2 py-1 h-72 overflow-scroll mt-1">
        <LinpxNovelWidget text={introLinpxNovelText} />
      </div>
      <div>对应的文本：</div>
      <div className="whitespace-pre-line bg-gray-300 rounded-lg px-2 py-1 h-72 overflow-scroll text-base">
        {introLinpxNovelText}
      </div>
    </div>
  );
};

export default HomeIntro;
