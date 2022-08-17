/**
 * 目前想大概有：
 * 1、首页加一个交互小说的入口，可以进入交互小说页面
 * 2、交互小说页面给出当前可以直接点开玩的小说列表、一个可以跳转到编辑页面的按钮、一个可以跳转到教程页面的按钮
 * 3、编辑页面有一个输入框或者编辑器那种，可以
 */

import PageLayout from '@/components/PageLayout';
import React, { useEffect, useState } from 'react';
import { fileApi } from './components/fileSystem';
import LinpxNovelWidget from './components/LinpxNovelWidget';
import { uid } from 'uid';
import { history } from 'umi';

const introLinpxNovelText = `【标签 开始】
今天天气真好呀，出去走走吧。
你决定去哪玩呢？
【选项】超市【跳转标签 去超市】
【选项】公园【跳转标签 去公园】

【标签 去超市】
你去超市买了好多吃的，很开心。
一天结束了。
【结束】

【标签 去公园】
你去公园玩，碰到了很多猫猫狗狗，很开心。
你碰到了一只头上顶着一片叶子的神奇的橘猫，他说能让你回到今天刚开始的时候。
你的反应是：
【选项】好呀，让今天重新开始吧【跳转标签 重新开始】
【选项】置之不理
你没有理橘猫，橘猫识相地走开了。
【结束】

【标签 重新开始】
【清空】
【跳转标签 开始】
`;

type IFileInfo = {
  id: string;
  title: string;
  time: string;
  text: string;
};

const jumpEditPage = (fileId: string) => {
  history.push(`/linpx/edit?file=${fileId}`);
};

export default function ({ history }: React.PropsWithChildren<any>) {
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
  }, []);

  const createFileAndEdit = ({
    title,
    text,
  }: {
    title: string;
    text: string;
  }) => {
    const fileId = fileApi.newFile(uid(16));
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
    <PageLayout title="交互小说">
      <div className="px-4 py-2">
        <div className="font-bold text-2xl">最近作品</div>
        {[
          '测试1',
          '测试2（内容一样，凑数的）',
          '测试3（内容一样，凑数的）',
        ].map((title, index) => (
          <div
            key={index}
            className="u-line-1"
            onClick={() => history.push(`/linpx/example?title=${title}`)}
          >
            {title}
          </div>
        ))}

        <div className="font-bold text-2xl mt-4">我也试试</div>
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
            onClick={() =>
              createFileAndEdit({ title: '新建空白文件', text: '' })
            }
          >
            从空文件创建
          </div>
        </div>
        <div>
          {fileInfoList.map(({ title, time, id }) => (
            <div
              key={time}
              className="flex px-4 py-1"
              onClick={() => jumpEditPage(id)}
            >
              <div className="u-line-1 flex-grow">{title}</div>
              <span className="text-base leading-8 text-gray-400 whitespace-nowrap">
                {time}
              </span>
            </div>
          ))}
        </div>

        <div className="font-bold text-2xl mt-4">Linpx-Word简介</div>
        <div className="text-base">
          <div>
            Linpx-Word是一个增量的，声明式的，用于为小说添加简单动效、选项分支和流程控制的文本格式。
          </div>
          <div>
            在已有的小说文本中添加一些简单的、中文的标签即可实现上述效果。整体类似于低配中文版的inky。
          </div>
          <div>下面是一个简单示例：</div>
          <div className="bg-gray-300 rounded-lg px-2 py-1 h-72 overflow-scroll mt-1">
            <LinpxNovelWidget text={introLinpxNovelText} />
          </div>
          <div>对应的文本：</div>
          <div className="whitespace-pre-line bg-gray-300 rounded-lg px-2 py-1 h-72 overflow-scroll text-base">
            {introLinpxNovelText}
          </div>
        </div>

        <div className="font-bold text-2xl mt-4">Linpx-Word教程（待完善）</div>
        <div>
          <div>声明标签、跳转标签</div>
          <div>声明选项</div>
          <div>声明开始、结束</div>
        </div>
      </div>
    </PageLayout>
  );
}
