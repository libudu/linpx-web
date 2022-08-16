import LinpxNovel, { IShowChoice, IShowText } from './LinpxNovel';

const exampleText = `提示：故事将从“开始”标签开始，在其之前的文本将会被跳过
【开始】
你看到敌人过来了。

【标签 战斗开始】
敌人来袭，是否战斗？
【选项】战斗【跳转标签 选择战斗】
【选项】放弃【跳转标签 选择放弃】
【选项】发呆
你什么也没做。
你被杀死了。
【结束】

【标签 选择战斗】
你战胜了敌人，游戏结束
【结束】

【标签 选择放弃】
你被敌人杀死了，是否重新开始
【选项】重新开始【跳转标签 战斗开始】
【选项】结束`;

const showText: IShowText = async (text) => {
  console.log(text);
  await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
};

let waitUserChooseResolve: (index: number) => any = null as any;
const waitUserChoose = async () => {
  return new Promise<number>((resolve) => (waitUserChooseResolve = resolve));
};

const showChoice: IShowChoice = async (choiceList) => {
  choiceList.forEach((choice, index) => {
    console.log(`选项${index}：${choice}`);
  });
  return await waitUserChoose();
};

(window as any).choose = (index: number) => waitUserChooseResolve(index);
(window as any).start = null;

const main = async () => {
  const novelInstance = new LinpxNovel({
    text: exampleText,
    showText,
    showChoice,
  });
  // novelInstance.start();
  (window as any).start = novelInstance.start;
};

main();
