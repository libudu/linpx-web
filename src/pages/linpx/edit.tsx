import PageLayout from '@/components/PageLayout';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import { IFileInfo } from '.';
import CodeEditor from './components/editor';
import { fileApi } from './components/fileSystem';

export default function ({ location }: IRouteComponentProps) {
  const [saved, setSaved] = useState(true);

  const [fileInfo, setFileInfo] = useState<IFileInfo>();
  useEffect(() => {
    const fileId = location.query['file'] as string;
    if (!fileId) return;
    const fileInfo: IFileInfo = JSON.parse(fileApi.readFile(fileId));
    setFileInfo(fileInfo);
  }, []);

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
    <PageLayout title="编辑交互小说">
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
        <div className="flex-grow">
          <CodeEditor
            initText={fileInfo.text || '请输入正文'}
            setText={(value) => onFileInfoChange('text', value)}
          />
        </div>
        <div>
          <div>验证</div>
          <div>预览</div>
        </div>
      </div>
    </PageLayout>
  );
}
