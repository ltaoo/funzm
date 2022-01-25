/**
 * @file loading
 */
import React from "react";
import cx from "classnames";

interface IProps {
  className?: string;
  theme?: "dark" | "light" | "yellow";
  tip?: string;
}
const Spin: React.FC<IProps> = (props) => {
  const { className, theme = "light", tip, children } = props;
  return (
    <div className={cx("spin", className, `spin--${theme}`)}>
      <div className="spin__inner">
        <div className="spin__line">
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
          <div className="spin__dot" />
        </div>
      </div>
      <div className="spin__tip">{tip || children}</div>
    </div>
  );
};

export default Spin;
