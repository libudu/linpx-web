import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
// 高亮选中行
import 'codemirror/addon/selection/active-line';
// 主题
import 'codemirror/theme/xq-light.css';

const CodeEditor: React.FC<{
  initText: string;
  setText: (text: string) => void;
  readOnly?: boolean;
}> = ({ initText, setText, readOnly = false }) => {
  return (
    <CodeMirror
      className="w-full h-full text-sm"
      options={{
        theme: 'xq-light',
        tabSize: 2,
        readOnly,
        mode: 'text/javascript',
        lineNumbers: true,
        lineWrapping: true,
        smartIndent: true,
        // 高亮选中行
        styleActiveLine: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      }}
      value={initText}
      onChange={(_, __, value) => {
        setText(value);
      }}
    />
  );
};

export default CodeEditor;
