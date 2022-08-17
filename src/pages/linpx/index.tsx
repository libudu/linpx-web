/**
 * 目前想大概有：
 * 1、首页加一个交互小说的入口，可以进入交互小说页面
 * 2、交互小说页面给出当前可以直接点开玩的小说列表、一个可以跳转到编辑页面的按钮、一个可以跳转到教程页面的按钮
 * 3、编辑页面有一个输入框或者编辑器那种，可以
 */

import PageLayout from '@/components/PageLayout';
import React from 'react';
import LinpxNovelWidget from './components/LinpxNovelWidget';

const introLinpxNovelText = `今天天气真好呀，出去走走吧。
你决定去哪玩呢？
【选项】超市【跳转标签 去超市】
【选项】公园【跳转标签 去公园】

【标签 去超市】
你去超市买了好多吃的，很开心。
一天结束了。
【结束】

【标签 去公园】
你去公园玩，碰到了很多猫猫狗狗，很开心。
一天结束了。
【结束】`;

export default function ({ history }: React.PropsWithChildren<any>) {
  return (
    <PageLayout title="交互小说">
      <div className="px-4 py-2">
        <div className="font-bold text-2xl">最近作品</div>
        <div onClick={() => history.push('/linpx/example')}>测试1</div>
        <div onClick={() => history.push('/linpx/example')}>
          测试2（内容一样，凑数的）
        </div>
        <div onClick={() => history.push('/linpx/example')}>
          测试3（内容一样，凑数的）
        </div>

        <div className="font-bold text-2xl mt-4">我也试试</div>
        <div className="flex justify-around mt-2">
          <div
            className="bg-linpx-orange text-xl font-bold rounded-full py-2 px-8 text-center"
            onClick={() => {}}
          >
            从样例创建
          </div>
          <div
            className="bg-linpx-orange text-xl font-bold rounded-full py-2 px-6 text-center"
            onClick={() => {}}
          >
            从空文件创建
          </div>
        </div>

        <div className="font-bold text-2xl mt-4">Linpx-Word简介</div>
        <div>
          <div>
            Linpx-Word是一个增量式的，声明式的，用于为小说添加简单动效、选项分支和流程控制的语法。
          </div>
          <div>
            通过在已有的小说中添加一些简单的、中文的标签。整体类似于低配中文版的inky。
          </div>
          <div>下面是一个简单示例：</div>
          <div className="bg-gray-200 rounded-lg p-1 h-52 overflow-scroll mt-1">
            <LinpxNovelWidget text={introLinpxNovelText} />
          </div>
        </div>

        <div className="font-bold text-2xl mt-4">Linpx-Word教程</div>
        <div>
          <div>声明标签、跳转标签</div>
          <div>声明选项</div>
          <div>声明开始、结束</div>
        </div>
      </div>
    </PageLayout>
  );
}
