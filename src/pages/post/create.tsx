import { postApi, usePixivNovelProfiles } from '@/api';
import PageLayout from '@/components/PageLayout';
import { Input } from 'antd';
import { Modal, Toast } from 'antd-mobile';
import { throttle } from 'lodash';
import { useState } from 'react';
import { IRouteComponentProps, history } from 'umi';

const { TextArea } = Input;

const clickSumbit = throttle(
  async (info: any, onSuccess: () => void) => {
    if (!info.title) {
      Toast.show('标题不可为空');
      return;
    }
    if (!info.content) {
      Toast.show('内容不可为空');
      return;
    }
    await postApi.postOne({
      ...info,
    });
    onSuccess();
  },
  1000,
  { trailing: false },
);

const NovelReferer: React.FC<{ novelId: string }> = ({ novelId }) => {
  const novelInfo = usePixivNovelProfiles([novelId])?.[0];
  if (!novelInfo) return <></>;
  const { title } = novelInfo;
  return (
    <TextArea
      style={{ fontSize: 16 }}
      disabled
      autoSize={{ minRows: 1, maxRows: 1 }}
      value={`引用小说：${title}`}
    />
  );
};

const NO_TAG_TEXT = '无标签';
const DIY_TAG_TEXT = '自定义';

const CreatePost: React.FC<IRouteComponentProps> = ({ location }) => {
  const [info, setInfo] = useState<any>({});
  const [tagText, setTagText] = useState('');
  const postTags = postApi.usePostTags();
  const { referType, referData } = location.query;
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  let referElement = null;
  if (referType == 'novel' && referData) {
    const novelId = String(referData);
    info['refer'] = {
      type: 'novel',
      data: referData,
    };
    referElement = <NovelReferer novelId={novelId} />;
  }

  return (
    <PageLayout
      title="发布新帖"
      rightEle={
        <div
          className="text-2xl"
          onClick={() =>
            clickSumbit(info, () => {
              if (referType == 'novel') {
                setShowSuccessModal(true);
              } else {
                history.goBack();
                Toast.show('发布成功！');
              }
            })
          }
        >
          发布
        </div>
      }
    >
      <div className="h-full flex flex-col">
        <div className="px-2">
          <div>帖子标签：</div>
          <div className="flex flex-wrap">
            {postTags &&
              [...postTags, { tag: NO_TAG_TEXT }, { tag: DIY_TAG_TEXT }].map(
                ({ tag }) => (
                  <div
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-sm mr-2 mb-1"
                    style={{ border: '1px solid rgb(245, 158, 11)' }}
                    onClick={() => {
                      // 选择无标签
                      if (tag == NO_TAG_TEXT) {
                        setTagText('');
                        info.tag = undefined;
                        return;
                      }
                      // 自定义标签
                      if (tag == DIY_TAG_TEXT) {
                        Modal.prompt(
                          '自定义标签',
                          '请输入自定义标签，长度6字及以下',
                          [
                            {
                              text: '取消',
                            },
                            {
                              text: '确定',
                              onPress: (value) =>
                                new Promise((resolve, reject) => {
                                  if (value.length > 6) {
                                    Toast.info('标签过长！');
                                    reject();
                                  } else {
                                    info.tag = value;
                                    setTagText(info.tag);
                                    resolve(1);
                                  }
                                }),
                            },
                          ],
                        );
                        return;
                      }
                      // 普通标签
                      setTagText(tag);
                      info.tag = tag;
                    }}
                  >
                    {tag}
                  </div>
                ),
              )}
          </div>
        </div>
        <Input
          placeholder="请输入标题"
          prefix={tagText && '#' + tagText}
          className="cover-antd-input"
          maxLength={100}
          onChange={(e) => (info['title'] = e.target.value)}
        />
        {referElement}
        <TextArea
          className="flex-grow"
          placeholder="请输入内容"
          style={{ fontSize: 16 }}
          maxLength={100000}
          onChange={(e) => (info['content'] = e.target.value)}
        />
        <Modal
          visible={showSuccessModal}
          transparent
          title="发表成功！"
          footer={[
            {
              text: '返回小说',
              onPress: () => history.goBack(),
            },
            {
              text: '查看帖子',
              onPress: () => history.push('/post'),
            },
          ]}
        />
      </div>
    </PageLayout>
  );
};

export default CreatePost;
