import AntTooltip from "rc-tooltip";

import "rc-tooltip/assets/bootstrap.css";

interface IProps {
  content?: string;
  placement?: string;
  children?: React.ReactNode;
}
const Tooltip: React.FC<IProps> = (props) => {
  const { content, placement, children } = props;

  return (
    <AntTooltip
      mouseEnterDelay={1}
      placement={placement}
      destroyTooltipOnHide
      overlay={<div>{content}</div>}
    >
      <span>{children}</span>
    </AntTooltip>
  );
};

export default Tooltip;
