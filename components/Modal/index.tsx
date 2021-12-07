import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export interface ModalProps {
  visible?: boolean;
}
const Modal = (props) => {
  const { visible = false, children, onCancel, onOk } = props;

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          //   if (curInputRef.current) {
          //     const obj = curInputRef.current!;
          //     if (window.getSelection) {
          //       obj.focus();
          //       const range = window.getSelection();
          //       range.selectAllChildren(obj);
          //       range.collapseToEnd();
          //     }
          //   }
          //   setOpen(false);
          if (onCancel) {
            onCancel();
          }
        }}
      >
        <div
          className="min-h-screen text-center md:block md:px-2 lg:px-4"
          style={{ fontSize: 0 }}
        >
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
          <span
            className="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div className="absolute bottom-0 md:relative text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
              <div className="w-full relative items-center rounded-t-xl pt-4 bg-white dark:bg-black pb-8 overflow-hidden sm:px-6 sm:pt-8 md:p-6 md:rounded-md lg:p-8">
                <div className="w-full min-h-60">{children}</div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
