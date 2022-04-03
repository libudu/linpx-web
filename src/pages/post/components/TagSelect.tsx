import { useRef, useState } from 'react';
import classNames from 'classnames';
// @ts-ignore
import useScrollOnDrag from 'react-scroll-ondrag';
import SortImg from '@/assets/icon/sort.png';
import { postApi } from '@/api';

interface ITagSelect {
  selectTags: Record<string, true>;
  setSelectTags: (selectTags: Record<string, true>) => void;
}

const TagSelect: React.FC<ITagSelect> = ({ selectTags, setSelectTags }) => {
  const tags = postApi.usePostTags();
  const tagList = tags?.map((tag) => tag.tag) || [];
  // 桌面端drag scroll
  const ref = useRef();
  const { events } = useScrollOnDrag(ref);
  const [tagbarOpen, setTagbarOpen] = useState(false);
  const element = (
    <div
      className={classNames(
        'flex overflow-x-scroll bg-gray-300 px-4 py-1 items-center select-none transition-all',
        { 'flex-wrap': tagbarOpen },
      )}
      ref={ref}
      {...events}
    >
      <img
        className="w-7 h-7 mr-2"
        src={SortImg}
        onClick={() => setTagbarOpen(!tagbarOpen)}
      />
      {[...tagList, '其他', '无标签'].map((tag) => {
        const isSelect = selectTags[tag];
        return (
          <div
            key={tag}
            className={classNames(
              'text-base rounded-full bg-yellow-500 px-2.5 py-1 mr-2 whitespace-nowrap my-0.5',
              { 'bg-opacity-40': !isSelect },
            )}
            onClick={() => {
              if (isSelect) {
                delete selectTags[tag];
                setSelectTags({ ...selectTags });
              } else {
                setSelectTags({ ...selectTags, [tag]: true });
              }
            }}
          >
            {tag == '其他' || tag == '无标签' ? tag : `#${tag}`}
          </div>
        );
      })}
    </div>
  );

  return element;
};

export default TagSelect;
