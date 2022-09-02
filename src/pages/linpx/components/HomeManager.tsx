import React, { useEffect, useState } from 'react';
import { fileApi } from '../utils/fileSystem';
import { uid } from 'uid';
import { introLinpxNovelText } from './HomeIntro';
import { IFileInfo } from '..';
import { history } from 'umi';

const jumpEditPage = (fileId: string) => {
  history.push(`/linpx/edit?file=${fileId}`);
};

const HomeManager: React.FC = () => {
  const [fileInfoRefresh, setFileInfoRefresh] = useState(0);
  const [fileInfoList, setFileInfoList] = useState<IFileInfo[]>([]);
  useEffect(() => {
    const fileNameList = fileApi.getFileList();
    const fileInfoList = fileNameList.map((fileId) => {
      const fileStr = fileApi.readFile(fileId);
      const contentObj = JSON.parse(fileStr) as IFileInfo;
      return contentObj;
      // 解析file数据，提取标题和时间信息
    });
    setFileInfoList(fileInfoList);
  }, [fileInfoRefresh]);

  const createFileAndEdit = ({
    title,
    text,
  }: {
    title: string;
    text: string;
  }) => {
    const fileId = fileApi.newFile(uid(8));
    const fileInfo = {
      id: fileId,
      title,
      time: new Date().toLocaleString(),
      text,
    };
    fileApi.writeFile(fileId, JSON.stringify(fileInfo));
    jumpEditPage(fileId);
  };

  return (
    <div>
      <div className="flex justify-around mt-2">
        <div
          className="bg-linpx-orange text-xl font-bold rounded-full py-2 px-8 text-center"
          onClick={() =>
            createFileAndEdit({
              title: '新建样例文件',
              text: introLinpxNovelText,
            })
          }
        >
          从样例创建
        </div>
        <div
          className="bg-linpx-orange text-xl font-bold rounded-full py-2 px-6 text-center"
          onClick={() => createFileAndEdit({ title: '新建空白文件', text: '' })}
        >
          从空文件创建
        </div>
      </div>
      <div>
        {fileInfoList.map(({ title, time, id, release }) => (
          <div key={time} className="flex px-2 py-1">
            <div className="flex flex-grow" onClick={() => jumpEditPage(id)}>
              <div className="u-line-1 flex-grow">
                {release && '*'}
                {title}
              </div>
              <span className="text-sm leading-8 text-gray-400 whitespace-nowrap">
                {time.slice(2, -3)}
              </span>
            </div>
            <span
              className="w-12 text-right flex-shrink-0"
              onClick={() => {
                const result = confirm(`确认删除【${title}】吗？`);
                if (result) {
                  fileApi.deleteFile(id);
                  setFileInfoRefresh(fileInfoRefresh + 1);
                }
              }}
            >
              删除
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeManager;
