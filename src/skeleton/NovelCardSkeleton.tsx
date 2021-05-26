import ContentBox from 'react-content-loader';

export default function NovelCardSkeleton({ number = 1 }: { number?: number }) {
  return (
    <>
      {Array(number)
        .fill(1)
        .map((_, index) => (
          <ContentBox
            key={index}
            backgroundColor="#8884"
            className="lp-shadow my-5 flex lp-bgcolor overflow-hidden w-full"
            style={{ height: 128 }}
          >
            <rect x="10" y="8%" rx="10" width="80" height="84%" />
            <rect x="100" y="17" rx="4" ry="4" width="60%" height="13" />
            <rect x="100" y="40" rx="3" ry="3" width="70%" height="10" />
          </ContentBox>
        ))}
    </>
  );
}
