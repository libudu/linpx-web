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
      <div className="flex justify-center mb-7 font-black">
        <div
          className="bg-linpx-orange text-xl rounded-full py-2 px-4 text-center mr-8"
          onClick={() =>
            createFileAndEdit({
              title: '新建样例文件',
              text: introLinpxNovelText,
            })
          }
        >
          创建新文档
        </div>
        <div
          className="bg-linpx-orange-unable text-xl rounded-full py-2 px-4 text-center"
          onClick={() => {}}
        >
          查看教程(todo)
        </div>
      </div>
      <div>
        {fileInfoList.map(({ title, time, id, release }) => (
          <div
            key={time}
            className="flex align-middle pl-3 pr-1 py-1 rounded-full my-2.5 text-lg"
            style={{ boxShadow: '0 0 4px #888' }}
          >
            <div className="flex flex-grow" onClick={() => jumpEditPage(id)}>
              <div className="u-line-1 flex-grow">
                {/* {release && '*'} */}
                {title}
              </div>
              <div className="w-28 mt-0.5 text-base text-gray-400 whitespace-nowrap">
                {time.slice(2, -3)}
              </div>
            </div>
            <span
              className="ml-2 mr-0.5 w-7 h-7 text-center flex-shrink-0 rounded-full bg-gray-400"
              onClick={() => {
                const result = confirm(`确认删除【${title}】吗？`);
                if (result) {
                  fileApi.deleteFile(id);
                  setFileInfoRefresh(fileInfoRefresh + 1);
                }
              }}
            >
              <div
                className="text-2xl text-white font-black relative"
                style={{ top: -3.5 }}
              >
                ×
              </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeManager;
