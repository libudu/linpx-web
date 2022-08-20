import PageLayout from '@/components/PageLayout';
import { IRouteComponentProps } from 'umi';
import LinpxNovelWidget from './components/LinpxNovelWidget';
import { useFileInfo } from './edit';

const exampleText = `提示：故事将从“开始”标签开始，在其之前的文本将会被跳过
【开始】
你看到敌人过来了。

【标签 战斗开始】
敌人来袭，是否战斗？
【选项】战斗【跳转标签 选择战斗】
【选项】放弃【跳转标签 选择放弃】
【选项】发呆
你什么也没做。
你被杀死了。
【结束】

【标签 选择战斗】
你战胜了敌人，游戏结束
【结束】

【标签 选择放弃】
你被敌人杀死了，是否重新开始
【选项】重新选择【跳转标签 重新选择】
【选项】结束
【结束】

【标签 重新选择】
【清空】
【跳转标签 战斗开始】`;

export default function ({ location }: IRouteComponentProps) {
  const fileId = location.query['file'] as string;
  let fileInfo = useFileInfo(fileId);
  if (fileId === 'example') {
    fileInfo = {
      id: 'example',
      title: '示例',
      text: exampleText,
      time: '',
    };
  }
  return (
    <PageLayout title={fileInfo?.title || ''}>
      {fileInfo && <LinpxNovelWidget text={fileInfo.text} />}
    </PageLayout>
  );
}
