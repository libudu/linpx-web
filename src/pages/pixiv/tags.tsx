import { TagBoxList } from '@/components/TagBox';
import { getFavUserTagInfo } from '@/utils/api';
import { history } from 'umi';

export default function PixivAllTags() {
  const tagListData = getFavUserTagInfo().data;
  return (
    <TagBoxList
      tagList={tagListData}
      onClickTag={(tagName) => history.push(`/pixiv/tag/${tagName}`)}
    />
  );
}
