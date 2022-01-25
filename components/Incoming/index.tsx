import { BeakerIcon } from "@ltaoo/icons/outline";

const IncomingTip = () => {
  return (
    <div className="flex justify-center py-4 min-h-12 rounded-xl bg-gray-100">
      <div className="flex flex-col items-center">
        <BeakerIcon className="w-8 h-8 text-gray-500" />
        <div className="text-gray-500">敬请期待</div>
      </div>
    </div>
  );
};

export default IncomingTip;
