import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { useVisible } from "@/hooks";
import {
  fetchWeappLoginQrcodeService,
  fetchWeappLoginQrcodeStatusService,
} from "@/services/wx";
import Modal from "@/components/Modal";
import { buffer2ImgUrl } from "@/utils";
import { WeappQrcodeStatus } from "@/constants";

const WeappLoginModal = (props) => {
  const { children } = props;

  const router = useRouter();
  const [qrcode, setQrcode] = useState(null);
  const [visible, show, hide] = useVisible();
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const fetchWeappQrcode = useCallback(async () => {
    // @ts-ignore
    const { image: buffer } = await fetchWeappLoginQrcodeService();
    const imgUrl = buffer2ImgUrl(buffer);
    setQrcode(imgUrl);

    timerRef.current = setInterval(async () => {
      const { status } = await fetchWeappLoginQrcodeStatusService();
      if (status === WeappQrcodeStatus.Confirmed) {
        clearInterval(timerRef.current);
        router.push({
          pathname: "/dashboard",
        });
      }
      if (status === WeappQrcodeStatus.Expired) {
        clearInterval(timerRef.current);
        alert("请刷新页面重试");
      }
    }, 2000);
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
        <img className="mt-8 w-48 h-48" src={qrcode} />
      </Modal>
    </>
  );
};

export default WeappLoginModal;
