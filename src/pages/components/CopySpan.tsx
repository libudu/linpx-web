import { copyTextAndToast } from '@/utils/clipboard';
import React from 'react';

const CopySpan: React.FC<{ text: string; style?: React.CSSProperties }> = ({
  text,
  style,
  children,
}) => {
  return (
    <span
      className="underline text-blue-500"
      style={style}
      onClick={() => copyTextAndToast(text, '复制成功！')}
    >
      {children}
    </span>
  );
};

export default CopySpan;
