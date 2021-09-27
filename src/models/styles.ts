import { useState, useCallback } from 'react';

// 由于未知原因，放在antd overlay中的NovelMenu直接调用useModel会报错
// 所以只能手动导出
export let setNovelStyles: (newStyles: Partial<StyleType>) => void;

const defaultStyle = {
  fontFamily: '',
  fontSizeClass: 'text-lg',
  bgColor: '',
  color: '#000',
};

type StyleType = typeof defaultStyle;

export default function () {
  const [novelStyles, setStyle] = useState(defaultStyle);

  const _setNovelStyles = useCallback((newStyles: Partial<StyleType>) => {
    setStyle({
      ...novelStyles,
      ...newStyles,
    });
  }, []);

  setNovelStyles = _setNovelStyles;

  return {
    novelStyles,
    setNovelStyles: _setNovelStyles,
  };
}
