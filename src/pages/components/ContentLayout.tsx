import { history } from 'umi';
import classnames from 'classnames';

// 内容标题
export function ContentTitle({
  left,
  right = '查看全部',
  clickRightPath,
}: {
  left: any;
  right?: any;
  clickRightPath?: any;
}) {
  return (
    <div className="mb-3 mt-6 flex items-end">
      <div
        className="inline-block font-bold text-3xl pl-2"
        style={{ width: 'max-content' }}
        children={left}
      />
      <div
        className="inline-block text-base text-right pr-2 flex-grow"
        children={
          <span
            style={{ borderBottom: '1px solid black' }}
            children={right}
            onClick={() => {
              history.push(clickRightPath);
            }}
          />
        }
      />
    </div>
  );
}

export function ContentBox({
  children,
  className,
}: {
  children: any;
  className?: any;
}) {
  return (
    <div
      className={classnames(
        'lp-shadow lp-bgcolor flex overflow-x-scroll show-scrollbar',
        className,
      )}
      style={{ minHeight: '6rem' }}
    >
      {children}
    </div>
  );
}
