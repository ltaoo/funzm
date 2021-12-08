/**
 * @file 弹层，只提供动画与内容区域
 */
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export interface PopupProps {
  visible?: boolean;
}
const Popup = (props) => {
  const { visible = false, mask = true, children } = props;

  return (
    <Transition.Root appear={true} show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {}}
      >
        <div
          className="min-h-screen text-center md:block md:px-2 lg:px-4"
          style={{ fontSize: 0 }}
        >
          {mask && (
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
          )}
          <span
            className="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            appear={true}
            enter="ease-out duration-1000 transition-translate transition-scale"
            enterFrom="translate-y-12 scale-10"
            enterTo="translate-y-0 scale-100"
            leave="ease-in duration-1000 transition-opacity transition-translate transition-scale"
            leaveFrom="opacity-100 translate-y scale-100"
            leaveTo="opacity-0 translate-y-4 scale-10"
          >
            <div>{children}</div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Popup;
