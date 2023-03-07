/**
 * @file loading
 */
import React from "react";
import cx from "classnames";

interface IProps {
  className?: string;
  tipClassName?: string;
  theme?: "dark" | "light" | "yellow";
  tip?: string;
  children?: React.ReactNode;
}
const Spin: React.FC<IProps> = (props) => {
  const { className, tipClassName, theme = "light", tip, children } = props;
  return (
    <div className={cx("spin", className, `spin--${theme}`)}>
      <div className="spin__inner inline-block">
        <div className="spin__line">
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
        </div>
      </div>
      <div className={cx("spin__tip text-lg text-gray-800", tipClassName)}>
        {tip || children}
      </div>
    </div>
  );
};

export default Spin;
