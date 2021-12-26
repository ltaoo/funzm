import React from "react";
import ReactDOM from "react-dom";
// import Dialog from "rc-dialog";

import ResultTip from "@/components/ResultTip";

let insertedDialogContainer = null;
/**
 * 展示弹窗
 */
export function showModal(content, props: { duration?: number } = {}) {
  if (insertedDialogContainer === null) {
    const $container = document.createElement("div");
    insertedDialogContainer = $container;
    document.body.appendChild(insertedDialogContainer);
  }
  ReactDOM.render(
    React.createElement(
      ResultTip,
      {
        visible: true,
        ...props,
      },
      content
    ),
    insertedDialogContainer
  );
  if (props?.duration) {
    setTimeout(() => {
      ReactDOM.render(
        React.createElement(
          ResultTip,
          {
            visible: false,
            ...props,
          },
          content
        ),
        insertedDialogContainer
      );
      setTimeout(() => {
        document.body.removeChild(insertedDialogContainer);
        insertedDialogContainer = null;
      }, 800);
    }, props.duration);
  }
}

/**
 * 隐藏弹窗
 */
export function hideModal() {}
