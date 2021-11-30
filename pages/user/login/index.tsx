/**
 * @file 用户登录
 */
import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { message, Button, Form, Input } from "antd";
import { getCsrfToken, signin } from "@/next-auth/client";
import { login } from "@/services/auth";

const LoginPage = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const init = useCallback(async () => {
    // form.setFieldsValue({ csrfToken });
  }, []);

  useEffect(() => {
    init();
  }, []);

  const loginAccount = useCallback(async () => {
    const values = await form.validateFields();
    const { email, password } = values;
    console.log("[PAGE]loginAccount", values);
    signin("credentials", {
      email,
      password,
      callbackUrl: "/abc",
    });
    // const { data } = await login(values);
    // localStorage.setItem("token", data.token);
    // message.success("登录成功");
    // router.push({
    //   pathname: "/dashboard",
    // });
  }, []);

  return (
    <div className="mx-auto w-80 sm:w-120 ">
      <h2 className="pt-4 text-2xl">CAPTION</h2>
      <div className="mt-4 p-4 rounded shadow-lg">
        <div>
          <p className="my-2 text-lg">登录您的账户</p>
          <Form
            form={form}
            // action="/api/auth/callback/credentials"
            // method="post"
            onFinish={loginAccount}
          >
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
