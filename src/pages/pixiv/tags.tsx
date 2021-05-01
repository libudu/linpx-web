import { TagBoxList } from '@/components/TagBox';
import { getFavUserTagInfo } from '@/utils/api';
import { history } from 'umi';

export default function PixivAllTags() {
  const tagListData = getFavUserTagInfo().data;
  return (
    <div className="m-2">
      <TagBoxList
        tagList={tagListData}
        onClickTag={(tagName) => history.push(`/pixiv/tag/${tagName}`)}
      />
    </div>
  );
}
