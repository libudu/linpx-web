import PageLayout from '@/components/PageLayout';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { history, IRouteComponentProps } from 'umi';
import { IFileInfo } from '.';
import CodeEditor from './components/editor';
import { fileApi } from './utils/fileSystem';
import { openModal } from '@/components/LinpxModal';
import CopySpan from '../components/CopySpan';
import PostModal from './components/PostModal';
import { getLinpxNovelShareInfo } from './utils';
import LinpxNovel from './utils/LinpxNovel';
import ErrorModal from './components/ErrorModal';

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
        <div className="flex">
          <Input
            placeholder="请输入标题"
            className="cover-antd-input"
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
        <div
          className="text-sm text-gray-500"
          style={{ padding: '0 6px 0 10px' }}
        >
          <div className="my-1">
            提示：文本仅临时存储在当前网址的本地缓存中，为避免数据遗失请及时备份。
            <CopySpan text={text}>全部复制</CopySpan>
          </div>
          {release && (
            <div className="my-1">
              该作品已发布，点击
              <CopySpan text={getLinpxNovelShareInfo(id).url}>
                复制分享链接
              </CopySpan>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <CodeEditor
            initText={text || '请输入正文'}
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
              const noError = checkTextNoError(text);
              if (noError && saved) {
                history.push(`/linpx/run/${id}`);
              }
            }}
          >
            预览
          </div>
          <div className="w-0.5 h-full bg-gray-200" />
          <div
            className="flex-grow py-2 bg-gray-200"
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
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
