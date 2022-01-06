/**
 * @file 带文字的图标
 */
import React from "react";
import cx from "classnames";

const sizeClassNames = {
  small: "",
  default: "w-10 h-10",
  large: "w-14 h-14",
};
interface IProps {
  icon: React.FC;
  txt?: string;
  size?: "small" | "default" | "large";
  onClick?: (event?: React.MouseEvent) => void;
}
const IconWithTxt: React.FC<IProps> = (props) => {
  const { icon, txt, size = "default", children, onClick } = props;
  return (
    <div className="inline-block">
      <div>
        {React.createElement(icon, {
          // @ts-ignore
          className: cx(
            "p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100",
            sizeClassNames[size]
          ),
          onClick,
        })}
        <p className="text-sm text-center text-gray-500">{txt || children}</p>
      </div>
    </div>
  );
};

export default IconWithTxt;
