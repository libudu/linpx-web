import PageLayout from '@/components/PageLayout';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { history, IRouteComponentProps } from 'umi';
import { IFileInfo } from '.';
import CodeEditor from './components/editor';
import { fileApi } from './utils/fileSystem';
import { openModal } from '@/components/LinpxModal';
import PostModal from './components/PostModal';
import { getLinpxNovelShareInfo } from './utils';
import LinpxNovel from './utils/LinpxNovel';
import ErrorModal from './components/ErrorModal';
import { copyTextAndToast } from '@/utils/clipboard';
import classNames from 'classnames';

export const useFileInfo = (fileId: string) => {
  const [fileInfo, setFileInfo] = useState<IFileInfo>();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!fileId) return;
    const fileStr = fileApi.readFile(fileId);
    if (fileStr) {
      const fileInfo: IFileInfo = JSON.parse(fileStr);
      setFileInfo(fileInfo);
    }
  }, [index]);
  return {
    fileInfo,
    refreshFileInfo: () => setIndex(index + 1),
  };
};

const checkTextNoError = (text: string) => {
  const errorInfoList = LinpxNovel.checkText(text);
  if (errorInfoList.length) {
    openModal({
      children: <ErrorModal errorInfoList={errorInfoList} />,
    });
    return false;
  }
  return true;
};

const ButtonItem: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <div
      className={classNames('bg-gray-400 rounded-full pb-2 pt-1.5', className)}
      style={{ width: '30%' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default function ({ location }: IRouteComponentProps) {
  const [saved, setSaved] = useState(true);

  const { fileInfo, refreshFileInfo } = useFileInfo(
    location.query['file'] as string,
  );

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

  if (!fileInfo) {
    return null;
  }
  const { release, title, id, text } = fileInfo;
  return (
    <PageLayout type="flex-grow" title="编辑交互小说" rightEle={<div />}>
      <div className="flex flex-col h-full">
        <div className="text-sm text-gray-500">
          <div
            className="mt-2 mb-1 bg-red-600 rounded-xl mx-5 px-4 py-2 text-white"
            style={{ boxShadow: '0 0 4px #888' }}
          >
            提示：文本仅临时存储在当前网址的本地缓存中，为避免数据遗失请及时备份。
          </div>
          {/* {release && (
            <div className="my-1 px-4">
              该作品已发布，点击
              <CopySpan text={getLinpxNovelShareInfo(id).url}>
                复制分享链接
              </CopySpan>
            </div>
          )} */}
        </div>
        <div className="flex z-10" style={{ boxShadow: '0 2px 4px #ccc' }}>
          <Input
            placeholder="请输入标题"
            className="cover-antd-input"
            style={{ border: 'none', boxShadow: 'none' }}
            maxLength={100}
            defaultValue={title}
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
        <div className="flex-grow overflow-y-scroll">
          <CodeEditor
            initText={text || '请输入正文'}
            setText={(value) => onFileInfoChange('text', value)}
          />
        </div>
        <div
          className="flex justify-around text-xl font-bold text-center py-2"
          style={{ borderTop: '1px solid #ddd' }}
        >
          {
            // todo:快捷标签
          }
          <ButtonItem
            className="bg-gray-400"
            onClick={() => {
              const noError = checkTextNoError(text);
              if (noError && saved) {
                history.push(`/linpx/run/${id}`);
              }
            }}
          >
            预览
          </ButtonItem>
          <ButtonItem
            className="bg-linpx-blue text-white"
            onClick={() => copyTextAndToast(text, '复制成功！')}
          >
            全部复制
          </ButtonItem>
          <ButtonItem
            className="bg-linpx-orange text-white"
            onClick={() => {
              const noError = checkTextNoError(text);
              if (noError) {
                openModal({
                  children: (
                    <PostModal
                      fileInfo={fileInfo}
                      onClose={() => refreshFileInfo()}
                    />
                  ),
                });
              }
            }}
          >
            发布
          </ButtonItem>
        </div>
      </div>
    </PageLayout>
  );
}
