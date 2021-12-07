/**
 * @file 用户登录
 */
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "antd/lib/button";
import "antd/lib/button/style/index.css";
import Form from "antd/lib/form";
import "antd/lib/form/style/index.css";
import Input from "antd/lib/input";
import "antd/lib/input/style/index.css";
import message from "antd/lib/message";
import "antd/lib/message/style/index.css";

import { getCsrfToken, signin } from "@/next-auth/client";

const LoginPage = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const loadingRef = useRef(false);

  const init = useCallback(async () => {
    // form.setFieldsValue({ csrfToken });
  }, []);

  useEffect(() => {
    init();
  }, []);

  console.log("[PAGE]user.login", props);

  const loginAccount = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    const values = await form.validateFields();
    const { email, password, csrfToken } = values;
    const res = await signin("credentials", {
      email,
      password,
      csrfToken,
      redirect: false,
    });
    console.log("[PAGE]loginAccount", values, res);
    loadingRef.current = false;
    if (!res.error) {
      message.success("登录成功");
      router.replace({
        pathname: "/dashboard",
      });
      return;
    }
    const { msg } = res;
    message.error(msg);
  }, []);

  return (
    <div className="mx-auto w-80 sm:w-120 ">
      <h2 className="pt-4 text-2xl">CAPTION</h2>
      <div className="mt-4 p-4 rounded shadow-lg">
        <div>
          <p className="my-2 text-lg">登录您的账户</p>
          <Form form={form} onFinish={loginAccount}>
            <Form.Item name="csrfToken" initialValue={props.csrfToken} hidden>
              <div />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱",
                },
                {
                  type: "email",
                  message: "请输入合法的邮箱",
                },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
              ]}
            >
              <Input placeholder="请输入密码" type="password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form>
        </div>
      </div>
      <p className="mt-8 text-xs">
        没有账号？<Link href="/user/register">前往注册</Link>
      </p>
    </div>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
