import {
  ChartBarIcon,
  FireIcon,
  LightBulbIcon,
  ScissorsIcon,
} from "@heroicons/react/outline";

const SimpleExamOperator = (props) => {
  const { instance } = props;

  return (
    <div className="inline-flex space-x-4">
      <div>
        <ChartBarIcon
          className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => {
            if (!instance) {
              return;
            }
            instance.clear();
          }}
        />
        <p className="text-sm text-gray-500">统计</p>
      </div>
      <div>
        <LightBulbIcon className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100" />
        <p className="text-sm text-gray-500">提示</p>
      </div>
      <div>
        <ScissorsIcon
          className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => {
            if (!instance) {
              return;
            }
            instance.skip();
          }}
        />
        <p className="text-sm text-gray-500">跳过</p>
      </div>
      <div>
        <FireIcon
          className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => {
            if (!instance) {
              return;
            }
            instance.clear();
          }}
        />
        <p className="text-sm text-gray-500">清除</p>
      </div>
    </div>
  );
};

export default SimpleExamOperator;
