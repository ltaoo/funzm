/**
 * @file 测验操作栏（跳过、清除等操作）
 */

import { SkipIcon, ClearIcon, LogoutIcon } from "@ltaoo/icons/outline";

import IconWithTxt from "@/components/IconWithTxt";
import Exam from "@/domains/exam";

interface IProps {
  instance: Exam;
}
const SimpleExamOperator: React.FC<IProps> = (props) => {
  const { instance } = props;

  return (
    <div className="inline-flex space-x-4 text-center">
      <IconWithTxt
        icon={LogoutIcon}
        onClick={() => {
          if (!instance) {
            return;
          }
          instance.onFailed(instance.toJSON());
        }}
      >
        退出
      </IconWithTxt>
      {/* <IconWithTxt icon={LightBulbIcon}>提示</IconWithTxt> */}
      <IconWithTxt
        icon={SkipIcon}
        disabled={Number(instance.countdown) >= 95}
        onClick={() => {
          if (!instance) {
            return;
          }
          instance.skip();
        }}
      >
        跳过
      </IconWithTxt>
      <IconWithTxt
        icon={ClearIcon}
        onClick={() => {
          if (!instance) {
            return;
          }
          instance.clear();
        }}
      >
        清除
      </IconWithTxt>
    </div>
  );
};

export default SimpleExamOperator;
