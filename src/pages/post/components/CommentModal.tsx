import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Toast } from 'antd-mobile';
import { throttle } from 'lodash';

import { postCommentApi } from '@/api';
import { IPostComment } from '@/api/post';
import PostCommentRefer from './PostCommentRefer';
import classNames from 'classnames';

interface ICommentModal {
  show: boolean;
  setShow: (state: boolean) => void;
  postId: string;
  replyComment?: IPostComment;
  onSubmitSuccess?: () => void;
}

// 最大评论字数
const MAX_COMMENT_LENGTH = 10000;

const CommentModal: React.FC<ICommentModal> = ({
  show,
  setShow,
  postId,
  replyComment,
  onSubmitSuccess,
}) => {
  const [data, setData] = useState<any>({ text: '' });
  // 是否有回复
  data.reply = replyComment?.id;
  const ref = useRef<HTMLTextAreaElement>(null);
  // 自动聚焦输入框
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);
  // 提交防抖
  const submitComment = useCallback(
    throttle(
      async () => {
        if (data.text.length == 0) {
          Toast.info('回复内容不可为空！');
          return;
        }
        if (data.text.length > MAX_COMMENT_LENGTH) {
          Toast.info('字数过多超过10000字，提交失败！');
          return;
        }
        const res = await postCommentApi.postOne({
          postId,
          content: data.text,
          reply: data.reply,
        });
        if (res.error) {
          Toast.info('评论失败', 1.0, undefined, false);
        } else {
          Toast.info('评论成功', 1.0, undefined, false);
          data.text = '';
          setShow(false);
          onSubmitSuccess && onSubmitSuccess();
        }
      },
      1000,
      { trailing: false },
    ),
    [],
  );
  if (!show) return <></>;
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 z-20"
      onClick={() => setShow(false)}
    >
      <div
        className="w-full absolute bottom-0 lp-bgcolor px-4 pt-5 pb-3"
        style={{ boxShadow: '0 -2px 4px -1px #aaa' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classNames('relative', replyComment ? 'h-64' : 'h-48')}>
          <div
            className="absolute rounded-xl top-0 left-0 w-full h-full pointer-events-none"
            style={{ boxShadow: '0 0 4px #aaa inset' }}
          />
          <div className="h-full flex flex-col z-30 bg-white">
            {replyComment && (
              <PostCommentRefer
                {...replyComment}
                style={{
                  backgroundColor: 'white',
                  margin: '12px 10px 0px 10px',
                  zIndex: 10,
                }}
              />
            )}
            <textarea
              ref={ref}
              defaultValue={data.text}
              className="w-full border-0 p-2 resize-none flex-grow"
              onChange={(e: any) => (data.text = e.target.value)}
            />
          </div>
        </div>
        <div className="flex mt-3 flex-row-reverse">
          <div
            className="px-6 py-1 text-lg bg-linpx-orange rounded-full"
            onClick={submitComment}
          >
            发帖
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
