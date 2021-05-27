import ContentBox from 'react-content-loader';

export default function UserCardSkeleton({ number = 1 }: { number?: number }) {
  return (
    <>
      {Array(number)
        .fill(1)
        .map((_, index) => (
          <ContentBox
            key={index}
            backgroundColor="#8884"
            className="my-3 lp-shadow lp-bgcolor flex overflow-x-scroll w-full"
            style={{ height: 134 }}
          >
            <circle cx="55" cy="50" r="35" />
            <rect x="20" y="90" rx="4" ry="4" width="70" height="13" />
            <rect x="100" y="25" rx="4" ry="4" width="50%" height="13" />
            <rect x="100" y="50" rx="4" ry="4" width="60%" height="10" />
            <rect x="100" y="70" rx="4" ry="4" width="60%" height="10" />
          </ContentBox>
        ))}
    </>
  );
}
