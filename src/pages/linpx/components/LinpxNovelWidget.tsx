import React, { useEffect, useRef, useState } from 'react';
import { useAnimeListRef } from '../anime';
import LinpxNovel from '../LinpxNovel';

export default function ({ text }: { text: string }) {
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
      text,
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
      translateY: [10, 0],
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
