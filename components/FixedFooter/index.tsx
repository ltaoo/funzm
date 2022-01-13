/**
 * @file 固底的操作栏
 */

const FixedFooter = (props) => {
  const { children } = props;
  return (
    <div className="flex justify-end sticky bottom-0 min-h-16 py-4 px-4 bg-white space-x-2 border-t-1 dark:bg-black dark:border-gray-800">
      {children}
    </div>
  );
};

export default FixedFooter;
