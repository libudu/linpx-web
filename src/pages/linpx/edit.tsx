import PageLayout from '@/components/PageLayout';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { history, IRouteComponentProps } from 'umi';
import { IFileDetail, IFileInfo } from '.';
import CodeEditor from './components/editor';
import { fileApi } from './components/fileSystem';
import { copyTextAndToast } from '@/utils/clipboard';
import { closeModal, openModal } from '@/components/LinpxModal';
import { Toast } from 'antd-mobile';
import CopySpan from '../components/CopySpan';

export const useFileInfo = (fileId: string) => {
  const [fileInfo, setFileInfo] = useState<IFileInfo>();
  useEffect(() => {
    if (!fileId) return;
    const fileStr = fileApi.readFile(fileId);
    if (fileStr) {
      const fileInfo: IFileInfo = JSON.parse(fileStr);
      setFileInfo(fileInfo);
    }
  }, []);
  return fileInfo;
};

export default function ({ location }: IRouteComponentProps) {
  const [saved, setSaved] = useState(true);

  const fileInfo = useFileInfo(location.query['file'] as string);

  // 有内容发生变化
  const onFileInfoChange = (key: 'title' | 'text', value: string) => {
    if (!fileInfo) return;
    // 之前保存已不是最新状态
    if (saved) {
      setSaved(false);
    }
    // 更新并尝试保存
    fileInfo[key] = value;
    saveFileInfo(fileInfo);
  };

  // 覆写文件数据
  const saveFileInfo = useCallback(
    debounce(
      (fileInfo: IFileInfo) => {
        fileInfo.time = new Date().toLocaleString();
        fileApi.writeFile(fileInfo.id, JSON.stringify(fileInfo));
        setSaved(true);
      },
      500,
      { trailing: true },
    ),
    [],
  );

  if (!fileInfo) return null;
  return (
    <PageLayout title="编辑交互小说" rightEle={<div />}>
      <div className="flex flex-col h-full">
        <div className="flex">
          <Input
            placeholder="请输入标题"
            className="cover-antd-input"
            maxLength={100}
            defaultValue={fileInfo?.title}
            onChange={(e) =>
              onFileInfoChange('title', e.target.value as string)
            }
          />
          <div
            className="flex-shrink-0 px-2 leading-10 transition-all"
            style={{ opacity: saved ? 0.6 : 0 }}
          >
            已保存
          </div>
        </div>
        <div
          className="text-sm text-gray-500"
          style={{ padding: '0 6px 0 10px' }}
        >
          提示：文本仅临时存储在当前网址的本地缓存中，为避免数据遗失请及时备份。
          <CopySpan text={fileInfo.text}>全部复制</CopySpan>
        </div>
        <div className="flex-grow">
          <CodeEditor
            initText={fileInfo.text || '请输入正文'}
            setText={(value) => onFileInfoChange('text', value)}
          />
        </div>
        <div
          className="flex justify-between text-2xl text-center"
          style={{ borderTop: '2px solid #eee' }}
        >
          <div
            className="flex-grow py-2"
            onClick={() => {
              if (saved) {
                history.push(`/linpx/run?file=${fileInfo.id}`);
              }
            }}
          >
            预览
          </div>
          <div className="w-0.5 h-full bg-gray-200" />
          <div
            className="flex-grow py-2 bg-gray-200"
            onClick={() =>
              openModal({
                children: <PostLinpxNovelModal fileInfo={fileInfo} />,
              })
            }
          >
            发布
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

const PostLinpxNovelModal = ({ fileInfo }: { fileInfo: IFileInfo }) => {
  const { title } = fileInfo;
  const [fileDetail] = useState<Omit<IFileDetail, 'postTime'>>({
    author: '',
    password: '',
    ...fileInfo,
  });
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-md w-full z-20 px-3 py-4">
        <div className="text-2xl font-bold text-center">发布交互小说</div>
        <div className="text-sm text-center py-1 mb-1">
          发布后将生成分享链接，你可以将链接分享给朋友游玩
        </div>
        <Input
          className="cover-antd-input"
          prefix={<div className="mr-10">标题</div>}
          value={title}
          readOnly
        />
        <Input
          className="cover-antd-input"
          placeholder="请输入作者"
          defaultValue={fileDetail.author}
          prefix={<div className="mr-10">作者</div>}
          maxLength={100}
          onChange={(e) => (fileDetail.author = e.target.value)}
        />
        <Input
          className="cover-antd-input"
          placeholder="请输入编辑密码"
          defaultValue={fileDetail.password}
          prefix="编辑密码"
          maxLength={12}
          onChange={(e) => (fileDetail.password = e.target.value)}
        />
        <div className="text-sm mt-1 mb-3">
          由于linpx不设置账号系统，编辑密码可以防止他人篡改你的作品，并可以在遗失后找回作品
        </div>
        <div className="flex justify-center">
          <div
            className="text-2xl font-bold text-center bg-linpx rounded-full px-8 py-1"
            onClick={() => {
              if (!fileDetail.author) return Toast.fail('请输入作者', 1);
              if (!fileDetail.password) return Toast.fail('请输入编辑密码', 1);
              fileApi.writeFile(fileDetail.id, JSON.stringify(fileDetail));
              closeModal();
              setTimeout(
                () =>
                  openModal({
                    children: <PostSuccessModal fileId={fileInfo.id} />,
                  }),
                1,
              );
            }}
          >
            发布
          </div>
        </div>
      </div>
    </div>
  );
};

const PostSuccessModal = ({ fileId }: { fileId: string }) => {
  const fileDetail = useFileInfo(fileId) as IFileDetail;
  if (!fileDetail) return <div />;
  const { id, title, author, password } = fileDetail;
  const url = location.origin + '/linpx/run?file=' + id;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-md w-full z-20 px-3 py-4">
        <div className="text-2xl font-bold text-center mb-2">发布成功！</div>
        <Input
          className="cover-antd-input"
          prefix={<div className="mr-14 pr-1">ID</div>}
          value={id}
          readOnly
        />
        <Input
          className="cover-antd-input"
          prefix={<div className="mr-10">标题</div>}
          value={title}
          readOnly
        />
        <Input
          className="cover-antd-input"
          prefix={<div className="mr-10">作者</div>}
          value={author}
          readOnly
        />
        <Input
          className="cover-antd-input"
          prefix="编辑密码"
          value={password}
          readOnly
        />
        <Input
          className="cover-antd-input"
          prefix="分享网址"
          value={url}
          readOnly
        />
        <div className="flex justify-end">
          <CopySpan text={url}>复制链接</CopySpan>
        </div>
      </div>
    </div>
  );
};
