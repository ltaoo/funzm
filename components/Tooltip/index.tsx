import AntTooltip from "rc-tooltip";

import "rc-tooltip/assets/bootstrap.css";

interface IProps {
  content?: string;
  children?: React.ReactNode;
}
const Tooltip: React.FC<IProps> = (props) => {
  const { content, children } = props;

  return (
    <AntTooltip
      mouseEnterDelay={1}
      destroyTooltipOnHide
      overlay={<div>{content}</div>}
    >
      <span>{children}</span>
    </AntTooltip>
  );
};

export default Tooltip;
