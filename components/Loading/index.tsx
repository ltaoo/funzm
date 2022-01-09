/**
 * @file 弹窗
 */
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export interface ModalProps {
  visible?: boolean;
}
const Loading = (props) => {
  const { visible = false, children, onCancel, onOk } = props;

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          if (onCancel) {
            onCancel();
          }
        }}
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity" />
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-column items-center justify-center py-8 px-6 bg-gray-500 bg-opacity-50 rounded">
                <div className="inline-block text-center text-white">
                  <div className="flex items-center justify-center">
                    <svg
                      version="1.1"
                      x="0px"
                      y="0px"
                      width="40px"
                      height="40px"
                      viewBox="0 0 50 50"
                    >
                      <path
                        fill="currentColor"
                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                      >
                        <animateTransform
                          attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Loading;
