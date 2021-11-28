/**
 * @file 用户登录
 */
import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { message, Button, Form, Input } from "antd";

import { login } from "@/services/auth";

const LoginPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const loginAccount = useCallback(async () => {
    const values = await form.validateFields();
    console.log('[PAGE]loginAccount', values);
    await login(values);
    message.success("登录成功");
    router.push({
      pathname: "/dashboard",
    });
  }, []);

  return (
    <div className="mx-auto w-80 sm:w-120 ">
      <h2 className="pt-4 text-2xl">CAPTION</h2>
      <div className="mt-4 p-4 rounded shadow-lg">
        <div>
          <p className="my-2 text-lg">登录您的账户</p>
          <Form form={form}>
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
          </Form>
          <Button type="primary" size="large" block onClick={loginAccount}>
            登录
          </Button>
        </div>
      </div>
      <p className="mt-8 text-xs">
        没有账号？<Link href="/auth/register">前往注册</Link>
      </p>
    </div>
  );
};

export default LoginPage;
