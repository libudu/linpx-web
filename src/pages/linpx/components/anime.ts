import { useEffect, useRef } from 'react';
import anime, { AnimeParams } from 'animejs';

export const useAnimeListRef = (
  animeParamList: (Omit<AnimeParams, 'targets'> | false)[],
) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const target = ref.current;
      // 逐个应用
      animeParamList
        .filter((i) => i)
        .forEach((animeParam) => {
          anime({
            targets: target,
            ...animeParam,
          });
        });
      // 组件卸载时清空动画，避免循环动画导致的内存泄漏
      return () => anime.remove(target);
    }
  }, []);
  return ref;
};
