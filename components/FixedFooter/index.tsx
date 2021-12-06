/**
 * @file 固底的操作栏
 */

const FixedFooter = (props) => {
  const { dataSource } = props;
  return (
    <div className="flex justify-end sticky bottom-0 py-4 px-4 bg-white dark:bg-black space-x-2 border-t-1 dark:border-gray-800">
      {dataSource.map((menu) => {
        const { id, text, onClick } = menu;
        return (
          <p
            key={id}
            className="text-base text-sm cursor-pointer text-black dark:text-white"
            onClick={onClick}
          >
            {text}
          </p>
        );
      })}
    </div>
  );
};

export default FixedFooter;
