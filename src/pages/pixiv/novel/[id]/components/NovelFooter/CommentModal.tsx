import { Toast } from 'antd-mobile';
import TextArea from 'antd/lib/input/TextArea';
import classNames from 'classnames';
import { throttle } from 'lodash';
import {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactElement,
} from 'react';

let lastCommentText = '';
let isCommenting = false;

// 评论模态框
interface CommentModalProps {
  lineSize?: [number, number];
  submitText?: string;
  replyEle?: ReactElement;
  onSubmit: (content: string) => Promise<boolean>;
}

// 最大评论字数
const MAX_COMMENT_LENGTH = 10000;

const CommentModal: FC<CommentModalProps> = ({ replyEle, onSubmit }) => {
  const [data, setData] = useState<any>({ text: lastCommentText });
  // 自动聚焦输入框
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  // 提交防抖
  const submitComment = useCallback(
    throttle(
      () => {
        if (data.text.length == 0) {
          Toast.info('回复内容不可为空！');
          return;
        }
        if (data.text.length > MAX_COMMENT_LENGTH) {
          Toast.info(`字数过多超过${MAX_COMMENT_LENGTH}字，提交失败！`);
          return;
        }
        // 返回是否回复成功的布尔结果
        return onSubmit(data.text);
      },
      1000,
      { trailing: false },
    ),
    [],
  );
  return (
    <div
      className="w-full absolute bottom-0 bg-white px-4 pt-5 pb-4"
      style={{ boxShadow: '0 -2px 4px -1px #aaa' }}
    >
      <div className={classNames('relative', replyEle ? 'h-64' : 'h-48')}>
        <div
          className="absolute rounded-xl top-0 left-0 w-full h-full pointer-events-none"
          style={{ boxShadow: '0 0 4px #aaa inset' }}
        />
        <div className="h-full flex flex-col z-30 bg-white">
          {replyEle && <div className="mt-1.5">{replyEle}</div>}
          <textarea
            ref={ref}
            defaultValue={data.text}
            className="w-full border-0 p-2 resize-none flex-grow"
            onChange={(e: any) => {
              data.text = e.target.value;
              lastCommentText = data.text;
            }}
          />
        </div>
      </div>
      <div className="flex justify-end text-2xl">
        <span
          className="px-6 py-1 bg-linpx-orange rounded-full mt-3"
          onClick={async () => {
            // 避免因为网络延迟导致的用户重复点击发送请求
            if (isCommenting == false) {
              isCommenting = true;
              const success = await submitComment();
              if (success) {
                data.text = '';
                lastCommentText = '';
              }
              isCommenting = false;
            }
          }}
        >
          评论
        </span>
      </div>
    </div>
  );
};

export default CommentModal;
