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

const CreatePost: React.FC<IRouteComponentProps> = ({ location }) => {
  const [info, setInfo] = useState<any>({});
  const { referType, referData, from } = location.query;
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
        <TextArea
          placeholder="请输入标题"
          style={{ fontSize: 20, fontWeight: 'bold' }}
          autoSize={{ minRows: 1, maxRows: 1 }}
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
