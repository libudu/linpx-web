import { TagBoxList } from '@/components/TagBox';
import { useLinpxAnalyseTag } from '@/utils/api';
import { history } from 'umi';

export default function PixivAllTags() {
  const analyseTag = useLinpxAnalyseTag();
  const tagListData = analyseTag?.data || [];

  return (
    <div className="m-2">
      <TagBoxList
        tagList={tagListData}
        onClickTag={(tagName) => history.push(`/pixiv/tag/${tagName}`)}
      />
    </div>
  );
}
