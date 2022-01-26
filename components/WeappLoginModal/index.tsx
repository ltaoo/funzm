import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";

import { CheckCircleIcon, RefreshIcon } from "@ltaoo/icons/outline";

import { useVisible } from "@/hooks";
import {
  fetchWeappLoginQrcodeService,
  fetchWeappLoginQrcodeStatusService,
} from "@/services/wx";
import { buffer2ImgUrl, loopRequest } from "@/utils";
import { WeappQrcodeStatus } from "@/constants";
import Modal from "@/components/Modal";
import Spin from "@/components/Spin";

const WeappLoginModal = (props) => {
  const { children } = props;

  const router = useRouter();
  const [qrcode, setQrcode] = useState(null);
  const [visible, show, hide] = useVisible();
  const [status, setStatus] = useState(WeappQrcodeStatus.Wait);
  const loadingRef = useRef(false);

  const fetchWeappQrcode = useCallback(async () => {
    setQrcode(null);
    setStatus(WeappQrcodeStatus.Wait);
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    const { image: buffer } = await fetchWeappLoginQrcodeService();
    const imgUrl = buffer2ImgUrl(buffer);
    loadingRef.current = false;
    setQrcode(imgUrl);
    loopRequest(fetchWeappLoginQrcodeStatusService, ({ status }) => {
      setStatus(status);
      if (status === WeappQrcodeStatus.Confirmed) {
        setTimeout(() => {
          router.push({
            pathname: "/dashboard",
          });
        }, 800);
        return true;
      }
      if (status === WeappQrcodeStatus.Expired) {
        return true;
      }
    });
  }, []);

  return (
    <>
      <span
        onClick={() => {
          fetchWeappQrcode();
          show();
        }}
      >
        {children}
      </span>
      <Modal visible={visible} onCancel={hide}>
        <div className="text-gray-800 text-center">请使用微信扫码登录</div>
        <div className="relative">
          <img className="mt-8 w-48 h-48" src={qrcode} />
          {status !== WeappQrcodeStatus.Wait && (
            <div className="#mask absolute inset-0 bg-white opacity-90" />
          )}
          {qrcode === null && (
            <div
              className="center text-center cursor-pointer"
              onClick={fetchWeappQrcode}
            >
              <Spin className="mt-4" theme="dark" />
            </div>
          )}
          {status === WeappQrcodeStatus.Expired && (
            <div
              className="center text-center cursor-pointer"
              onClick={fetchWeappQrcode}
            >
              <RefreshIcon className="inline-block w-12 h-12 text-gray-500" />
              <div className="mt-2 text-center text-xl text-gray-800">
                点击刷新
              </div>
            </div>
          )}
          {status === WeappQrcodeStatus.Confirmed && (
            <div className="center text-center">
              <CheckCircleIcon className="inline-block w-12 h-12 text-green-500" />
              <div className="mt-2 text-center text-xl text-green-500">
                登录中...
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default WeappLoginModal;
