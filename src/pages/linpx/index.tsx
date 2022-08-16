import React, { useEffect, useRef, useState } from 'react';
import { useAnimeListRef } from './anime';
import LinpxNovel, { IShowChoice } from './LinpxNovel';

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
【选项】重新选择【跳转标签 重新选择】
【选项】结束
【结束】

【标签 重新选择】
【清空】
【跳转标签 战斗开始】`;

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
      clearText: async () => {
        // 清空选项和文字记录
        setTextList([]);
        setChoiceList(null);
      },
    });
    novelInstance.start();
  }, []);

  return (
    <div className="whitespace-pre-wrap">
      {textList.map((text, index) => (
        <BottomFadeIn key={index}>{text}</BottomFadeIn>
      ))}
      {choiceList && (
        <BottomFadeIn>
          <div className="flex justify-around">
            {choiceList.map((text, index) => (
              <div
                key={index}
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
        </BottomFadeIn>
      )}
    </div>
  );
}

const BottomFadeIn: React.FC = ({ children }) => {
  const ref = useAnimeListRef([
    {
      opacity: [0, 1.0],
      translateY: [20, 0],
      duration: 500,
      easing: 'easeInQuad',
    },
  ]);
  return (
    <div className="opacity-0" ref={ref}>
      {children}
    </div>
  );
};
