import {
  ChartBarIcon,
  FireIcon,
  LightBulbIcon,
  ScissorsIcon,
} from "@heroicons/react/outline";

const SimpleExamOperator = (props) => {
  const { instance } = props;

  return (
    <div className="flex space-x-4">
      <ChartBarIcon
        className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
        onClick={() => {
          if (!instance) {
            return;
          }
          instance.clear();
        }}
      />
      <LightBulbIcon className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100" />
      <ScissorsIcon
        className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
        onClick={() => {
          if (!instance) {
            return;
          }
          instance.skip();
        }}
      />
      <FireIcon
        className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
        onClick={() => {
          if (!instance) {
            return;
          }
          instance.clear();
        }}
      />
    </div>
  );
};

export default SimpleExamOperator;
