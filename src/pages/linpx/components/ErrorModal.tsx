export default function ({ errorInfoList }: { errorInfoList: string[] }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-md w-full z-20 px-3 py-4">
        <div className="text-2xl font-bold text-center pb-1">
          文本中存在错误！
        </div>
        <div className="text-lg">
          {errorInfoList.map((error, index) => (
            <div key={index}>·{error}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
