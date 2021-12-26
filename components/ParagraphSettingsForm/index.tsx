/**
 * @file 段落样式调整表单
 */
const ParagraphSettingsForm = () => {
  return (
    <div>
      <div>
        <div className="#title text-2xl text-gray-500">通用</div>
        <div className="flex">
          <div className="#label mr-4">中英文间距</div>
          <div>
            <input value="18" type="color" />
          </div>
        </div>
      </div>
      <div className="#field mt-12">
        <div className="#title text-2xl text-gray-500">中文</div>
        <div className="items-center ml-2 mt-2">
          <div className="flex">
            <div className="#label mr-4">文字大小</div>
            <div>
              <input value="18" />
            </div>
          </div>
          <div className="flex">
            <div className="#label mr-4">文字颜色</div>
            <div>
              <input value="18" type="color" />
            </div>
          </div>
          <div className="flex">
            <div className="#label mr-4">隐藏/展示</div>
            <div>
              <input value="18" type="color" />
            </div>
          </div>
        </div>
      </div>
      <div className="#field mt-12">
        <div className="#title text-2xl text-gray-500">英文</div>
        <div className="items-center ml-2 mt-2">
          <div className="flex">
            <div className="#label mr-4">文字大小</div>
            <div>
              <input value="27" />
            </div>
          </div>
          <div className="flex">
            <div className="#label mr-4">文字颜色</div>
            <div>
              <input value="27" type="color" />
            </div>
          </div>
          <div className="flex">
            <div className="#label mr-4">隐藏/展示</div>
            <div>
              <input value="18" type="color" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParagraphSettingsForm;
