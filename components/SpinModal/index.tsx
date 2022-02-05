/**
 * @file Loading 弹窗
 */
import { Fragment, useCallback } from "react";
import { render } from "react-dom";
import { Dialog, Transition } from "@headlessui/react";

import Spin from "@/components/Spin";

export interface ModalProps {
  visible?: boolean;
}
const SpinModal = (props) => {
  const { visible = false, title, onCancel } = props;

  const closeModal = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <Transition.Root show={visible} as="div">
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={closeModal}
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
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div className="absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center justify-center w-48 h-54 bg-gray-100 rounded">
                <Spin tip={title} theme="dark" />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

let $c = null;
export const showLoading = ({ title }: { title?: string } = {}) => {
  $c = document.createElement("div");
  document.body.appendChild($c);
  render(<SpinModal visible title={title} />, $c);
};
export const hideLoading = () => {
  return new Promise((resolve) => {
    if ($c === null) {
      return resolve(true);
    }
    render(<SpinModal visible={false} />, $c);
    setTimeout(() => {
      document.body.removeChild($c);
      resolve(true);
    }, 800);
  });
};

export default SpinModal;
