import React, { useEffect, useRef, useState } from 'react';
import { useAnimeListRef } from './anime';
import LinpxNovel from './LinpxNovel';

export type ITextInfo = {
  text: string;
  style?: React.CSSProperties;
};

export default function ({ text }: { text: string }) {
  const [textInfoList, setTextInfoList] = useState<ITextInfo[]>([]);
  const [choiceList, setChoiceList] = useState<string[] | null>(null);

  // 避免useEffect闭包陷阱
  const ref = useRef<{
    refTextList: ITextInfo[];
    refChoiceResolve: ((value: number) => void) | undefined;
  }>();
  ref.current = {
    refTextList: textInfoList,
    refChoiceResolve: ref.current?.refChoiceResolve,
  };

  useEffect(() => {
    const novelInstance = new LinpxNovel({
      text,
      showText: async (text) => {
        const refTextList = ref.current?.refTextList as ITextInfo[];
        setTextInfoList([...refTextList, text]);
        await new Promise((resolve) => setTimeout(() => resolve(null), 400));
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
        setTextInfoList([]);
        setChoiceList(null);
      },
    });
    novelInstance.start();
  }, []);

  return (
    <div className="whitespace-pre-wrap">
      {textInfoList.map(({ text, style }, index) => (
        <BottomFadeIn key={index}>
          <div style={style}>{text}</div>
        </BottomFadeIn>
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
      duration: 400,
      easing: 'easeInQuad',
    },
  ]);
  return (
    <div className="opacity-0" ref={ref}>
      {children}
    </div>
  );
};
