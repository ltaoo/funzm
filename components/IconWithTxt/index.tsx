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
  className?: string;
  size?: "small" | "default" | "large";
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (event?: React.MouseEvent) => void;
}
const IconWithTxt: React.FC<IProps> = (props) => {
  const {
    icon,
    txt,
    className,
    size = "default",
    disabled = false,
    children,
    onClick,
  } = props;
  return (
    <div className="inline-block">
      <div>
        {React.createElement(icon, {
          // @ts-ignore
          className: cx(
            "p-2 rounded cursor-pointer hover:bg-gray-100",
            sizeClassNames[size],
            disabled ? "text-gray-300" : "text-gray-500",
            className
          ),
          onClick: (event) => {
            if (disabled) {
              event.stopPropagation();
              return;
            }
            if (onClick) {
              onClick(event);
            }
          },
        })}
        <p className={cx("text-sm text-center text-gray-500", className)}>
          {txt || children}
        </p>
      </div>
    </div>
  );
};

export default IconWithTxt;
