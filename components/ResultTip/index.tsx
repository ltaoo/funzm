import { Fragment } from "react";
import { Transition } from "@headlessui/react";

const ResultTip = (props) => {
  const { visible, children } = props;
  return (
    <div>
      <Transition
        show={visible}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="fixed right-30 top-16 transform -rotate-6">
          {children}
        </div>
      </Transition>
    </div>
  );
};

export default ResultTip;
