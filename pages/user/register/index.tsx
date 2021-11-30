/**
 * @file 用户注册
 */
import { useCallback } from "react";
import Button from "antd/lib/button";
import "antd/lib/button/style/index.css";
import Input from "antd/lib/input";
import "antd/lib/input/style/index.css";
import Form from "antd/lib/form";
import "antd/lib/form/style/index.css";
import message from "antd/lib/message";
import "antd/lib/message/style/index.css";

import Link from "next/link";
import { useRouter } from "next/router";

import { register } from "@/services/auth";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const registerAccount = useCallback(async () => {
    const values = await form.validateFields();
    await register(values);
    message.success("注册成功");
    router.push({
      pathname: "/user/login",
    });
  }, []);

  return (
    <div className="mx-auto w-80 sm:w-120 ">
      <h2 className="pt-4 text-2xl">CAPTION</h2>
      <div className="mt-4 p-4 rounded shadow-lg">
        <div>
          <p className="my-2 text-lg">创建您的账户</p>
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
                  message: "请输入合法的邮箱地址",
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
              <Input
                placeholder="请输入密码"
                type="password"
                minLength={8}
                maxLength={20}
              />
            </Form.Item>
          </Form>
          <Button type="primary" size="large" block onClick={registerAccount}>
            注册
          </Button>
        </div>
      </div>
      <p className="mt-8 text-xs">
        已经有账号？<Link href="/auth/login">前往登录</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
