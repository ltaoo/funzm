/**
 * @file 用户登录
 */
import Link from "next/link";
import { Button, Form, Input } from "antd";

const LoginPage = () => {
  return (
    <div className="mx-auto w-80 sm:w-120 ">
      <h2 className="pt-4 text-2xl">CAPTION</h2>
      <div className="mt-4 p-4 rounded shadow-lg">
        <div>
          <p className="my-2 text-lg">登录您的账户</p>
          <Form>
            <Form.Item label="邮箱" name="email">
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input placeholder="请输入密码" type="password" />
            </Form.Item>
          </Form>
          <Button type="primary" size="large" block>
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
