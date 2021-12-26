/**
 * @file 更新日志
 */
const ChangelogPage = () => {
  return (
    <div className="md:mx-auto md:w-180">
      <div className="mt-12">
        <div className="text-2xl text-green-500">需求池</div>
        <div className="ml-4 mt-6">
          <div>
            下次功能发布节点
            <span className="ml-4 px-2 rounded text-sm text-green-500 bg-green-200">
              2022-01-02
            </span>
          </div>
          <div className="mt-2"></div>
          <ul className="pl-4 list-disc list-inside text-gray-900 dark:text-gray-200">
            <li className="text-gray-500">下载字幕文件时支持调整字体大小与颜色</li>
            <li className="text-gray-500">优化首页在移动端的展示效果</li>
            <li className="text-gray-500">首页支持暗黑模式</li>
          </ul>
        </div>
      </div>
      <hr className="mt-8" />
      <div className="mt-12 text-2xl text-green-500">更新日志</div>
      <div className="ml-4 mt-6">
        <div>
          <div className="text-xl">2021-12-26</div>
          <ul className="pl-4 list-disc list-inside text-gray-900 dark:text-gray-200">
            <li className="text-gray-500">支持调整字幕文字大小</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
