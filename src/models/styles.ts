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

const saveStyles = (styles: StyleType) => {
  localStorage.setItem('novelStyles', JSON.stringify(styles));
};

// 先从缓存取，取不到用默认值
let initStyle = JSON.parse(localStorage.getItem('novelStyles') || 'null');
if (!initStyle) {
  initStyle = defaultStyle;
  saveStyles(defaultStyle);
}

export default function () {
  const [novelStyles, setStyle] = useState(initStyle);

  const _setNovelStyles = (styleChanges: Partial<StyleType>) => {
    const newStyles = {
      ...novelStyles,
      ...styleChanges,
    };
    setStyle(newStyles);
    saveStyles(newStyles);
  };

  setNovelStyles = _setNovelStyles;

  return {
    novelStyles,
    setNovelStyles: _setNovelStyles,
  };
}
