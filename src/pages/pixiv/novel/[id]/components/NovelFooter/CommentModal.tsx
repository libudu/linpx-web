import TextArea from 'antd/lib/input/TextArea';
import classNames from 'classnames';
import { throttle } from 'lodash';
import { FC, useState, useEffect, useRef, useCallback } from 'react';

let lastCommentText = '';
let isCommenting = false;

// 评论模态框
interface CommentModalProps {
  lineSize?: [number, number];
  submitText?: string;
  onSubmit: (content: string) => Promise<boolean>;
}

const CommentModal: FC<CommentModalProps> = ({
  lineSize = [3, 5],
  submitText = '评论',
  onSubmit,
}) => {
  const [text, setText] = useState(lastCommentText);
  // 启动模态框时自动聚焦
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = ref.current as any;
    if (textarea) {
      textarea.focus();
      textarea.resizableTextArea.textArea.setSelectionRange(999, 999);
    }
  }, []);
  // 避免快速输入时出现卡顿
  const onTextChange = useCallback(
    throttle((e: any) => {
      const text = e.target.value;
      setText(text);
      lastCommentText = text;
    }, 200),
    [],
  );
  // 提交防抖
  const onSubmitThrottle = useCallback(
    throttle((text: string) => onSubmit(text), 1000, { trailing: false }),
    [],
  );
  return (
    <div className="w-full absolute bottom-0 bg-white p-4 pt-3">
      <div className="flex justify-between mb-3 text-2xl items-end">
        <span
          className={classNames('text-gray-400', {
            'text-red-600': text.length >= 1000,
          })}
        >
          {text.length}/1000
        </span>
        <span
          className="bg-yellow-500 py-1 px-2 rounded-md"
          onClick={async () => {
            if (isCommenting == false) {
              isCommenting = true;
              const success = await onSubmitThrottle(text);
              if (success) {
                lastCommentText = '';
              }
              isCommenting = false;
            }
          }}
        >
          {submitText}
        </span>
      </div>
      <TextArea
        autoSize={{ minRows: lineSize[0], maxRows: lineSize[1] }}
        style={{ fontSize: 24 }}
        ref={ref}
        defaultValue={lastCommentText}
        onChange={onTextChange}
        maxLength={1000}
      />
    </div>
  );
};

export default CommentModal;
