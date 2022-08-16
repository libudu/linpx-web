import { useEffect, useRef, useState } from 'react';
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

export default function () {
  const [textList, setTextList] = useState<string[]>([]);
  const [choiceList, setChoiceList] = useState<string[] | null>(null);

  // 避免useEffect闭包陷阱
  const ref = useRef<{
    refTextList: string[];
    refChoiceResolve: ((value: number) => void) | undefined;
  }>();
  ref.current = {
    refTextList: textList,
    refChoiceResolve: ref.current?.refChoiceResolve,
  };

  useEffect(() => {
    const novelInstance = new LinpxNovel({
      text: exampleText,
      showText: async (text) => {
        const refTextList = ref.current?.refTextList as string[];
        setTextList([...refTextList, text]);
        await new Promise((resolve) => setTimeout(() => resolve(null), 500));
      },
      showChoice: async (choiceList) => {
        setChoiceList(choiceList);
        const chosenIndex = await new Promise<number>(
          (resolve) => ((ref.current as any).refChoiceResolve = resolve),
        );
        return chosenIndex;
      },
    });
    novelInstance.start();
  }, []);
  return (
    <div className="whitespace-pre-wrap">
      {textList.map((text) => (
        <div>{text}</div>
      ))}
      {choiceList && (
        <div className="flex justify-around">
          {choiceList.map((text, index) => (
            <div
              className="bg-gray-600 text-white rounded-lg py-2 px-4 my-2"
              onClick={() => {
                const choiceResolve = ref.current?.refChoiceResolve;
                choiceResolve && choiceResolve(index);
                setChoiceList(null);
              }}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
