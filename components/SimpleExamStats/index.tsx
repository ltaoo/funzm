/**
 * 简单测验统计面板
 */
const SimpleExamStats = (props) => {
  const { data } = props;
  const { correct, incorrect, skipped, spend, endAt, correctRateText, score } =
    data;
  return (
    <div className="text-left">
      <div className="flex justify-between">
        <div className="w-24 text-center">
          <div className="text-md text-gray-400">正确数</div>
          <div className="ml-1 text-4xl text-gray-800">{correct}</div>
        </div>
        <div className="w-24 text-center">
          <div className="text-md text-gray-400">错误数</div>
          <div className="ml-1 text-4xl text-gray-800">{incorrect}</div>
        </div>
        <div className="w-24 text-center">
          <div className="text-md text-gray-400">跳过数</div>
          <div className="ml-1 text-4xl text-gray-800">{skipped}</div>
        </div>
      </div>
      <hr className="mt-12" />
      <div className="mt-8 ml-5">
        <div className="flex items-center">
          <div className="w-24 text-gray-400">完成于</div>
          <div className="ml-4 text-gray-800">{endAt}</div>
        </div>
        <div className="flex items-center">
          <div className="w-24 text-gray-400">耗时</div>
          <div className="ml-4 text-gray-800">{spend}</div>
        </div>
        <div className="flex items-center">
          <div className="w-24 text-gray-400">正确率</div>
          <div className="ml-4 text-gray-800">{correctRateText}</div>
        </div>
      </div>
      <hr className="mt-8" />
      <div className="mt-8 flex flex-row-reverse">
        <span className="mr-6 text-5xl text-gray-800">{score}</span>
        <span className="w-24 text-gray-800 self-end">获得积分数</span>
      </div>
    </div>
  );
};

export default SimpleExamStats;
