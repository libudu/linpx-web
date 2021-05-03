import { InputItem } from 'antd-mobile';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface ISearchBar {
  initWord?: string;
  onSearch: (word: string) => any;
}

export default function SearchBar({ initWord = '', onSearch }: ISearchBar) {
  const [word, setWord] = useState(initWord);
  const startSearch = () => word && onSearch(word);
  return (
    <div
      className="lp-shadow bg-white h-10 mt-8 flex items-center overflow-hidden"
      style={{ borderRadius: '9999px' }}
    >
      <SearchOutlined
        className="ml-1 pl-0.5 relative left-0.5"
        style={{ color: '#888', fontSize: '28px' }}
        onClick={startSearch}
      />
      <InputItem
        className="w-full"
        value={word}
        editable
        clear
        placeholder="支持链接、id、标题、tag……"
        onChange={(value) => setWord(value)}
        onVirtualKeyboardConfirm={startSearch}
      />
    </div>
  );
}
