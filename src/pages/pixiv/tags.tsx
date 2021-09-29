import { TagBoxList } from '@/components/TagBox';
import { useAnalyseTag } from '@/api';
import { history } from 'umi';

function PixivAllTags() {
  const analyseTag = useAnalyseTag();
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

export default PixivAllTags;
