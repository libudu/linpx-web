/** todo:
 *
 * 【分享功能】
 * 分享功能：生成可以分享给朋友的链接（已完成）
 * 分享前首先需要通过验证脚本是否存在错误
 * 然后填写作者字段，设置编辑密码字段，点击上传按钮就提交到服务器
 * 之后页面返回id、标题、作者、密码、分享网址，提供复制按钮，提示用户截图保存
 * 点击分享后，将文件id、时间、内容、标题发送到服务器，之前访问/share路径时其他用户就能从后端获取到信息。
 *
 * 【节点功能相关】
 * 开启、关闭节点。
 * 开启/关闭 文本显示过渡（默认开启）
 * 开启/关闭 结束的分割线和重新开始按钮（默认开启）
 * 开启/关闭 逐段点击（默认关闭）
 * 开启/关闭 合并相邻文本段（默认关闭）
 *
 * 【开放性与运营】
 * 首页功能引导
 * 作者名称字段
 *
 * 【编辑器】
 * 编辑时预检查：跳转的标签是否都存在
 * 如果有标签、跳转标签直接构成的循环怎么办？同一个节点遍历了1000次后自动提示错误。
 *
 * 【特殊效果（优先级低）】
 * 普通文本中的【加粗】、【斜体】、【发光】、【抖动】标签
 **/

import PageLayout from '@/components/PageLayout';
import React from 'react';
import HomeIntro from './components/HomeIntro';
import HomeManager from './components/HomeManager';

export type IFileInfo = {
  id: string;
  title: string;
  time: string;
  text: string;
  release?: boolean;
};

export interface IFileDetail extends IFileInfo {
  postTime: string;
  author: string;
  password: string;
}

export default function ({ history }: React.PropsWithChildren<any>) {
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
            className="u-line-1 bg-gray-200 my-2 rounded-lg px-2 py-1"
            onClick={() => history.push(`/linpx/run/example`)}
          >
            {title}
          </div>
        ))}

        <div className="font-bold text-2xl mt-4">我也试试</div>
        <HomeManager />

        <div className="font-bold text-2xl mt-4">Linpx-Word简介</div>
        <HomeIntro />

        <div className="font-bold text-2xl mt-4">Linpx-Word教程（待完善）</div>
        <div>
          <div>【标签】、【跳转标签 标签名】</div>
          <div>【选项】</div>
          <div>【开始】、【结束】</div>
          <div>【开始】、【结束】</div>
        </div>
      </div>
    </PageLayout>
  );
}
