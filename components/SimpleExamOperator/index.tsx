/**
 * @file 测验操作栏（跳过、清除等操作）
 */

import {
  SkipIcon,
  ClearIcon,
  XIcon,
  LightBulbIcon,
} from "@ltaoo/icons/outline";

import IconWithTxt from "@/components/IconWithTxt";
import Exam from "@/domains/exam/base";

interface IProps {
  instance: Exam;
  onTip?: () => void;
  onClear?: () => void;
}
const SimpleExamOperator: React.FC<IProps> = (props) => {
  const { instance, onClear, onTip } = props;

  return (
    <div className="inline-flex space-x-4 text-center">
      <IconWithTxt
        icon={XIcon}
        onClick={() => {
          if (!instance) {
            return;
          }
          instance.onFailed(instance.toJSON());
        }}
      >
        结束
      </IconWithTxt>
      <IconWithTxt
        icon={LightBulbIcon}
        onClick={() => {
          if (onTip) {
            onTip();
          }
        }}
      >
        提示
      </IconWithTxt>
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
          if (onClear) {
            onClear();
          }
        }}
      >
        清除
      </IconWithTxt>
    </div>
  );
};

export default SimpleExamOperator;
