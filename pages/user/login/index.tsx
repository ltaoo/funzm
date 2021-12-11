/**
 * @file 用户登录
 */
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LockClosedIcon } from "@heroicons/react/solid";
import Form from "rc-field-form";

import { getCsrfToken, signin } from "@/next-auth/client";

const LoginPage = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const loadingRef = useRef(false);

  console.log("[PAGE]user.login", props);

  const loginAccount = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    const values = await form.validateFields();
    const { email, password, csrfToken } = values;
    console.log(email, password, csrfToken);
    const res = await signin("credentials", {
      email,
      password,
      csrfToken,
      redirect: false,
    });
    console.log("[PAGE]loginAccount", values, res);
    loadingRef.current = false;
    if (!res.error) {
      // message.success("登录成功");
      router.replace({
        pathname: "/dashboard",
      });
      return;
    }
    const { msg } = res;
    // message.error(msg);
  }, []);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              没有账号？
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
                点击这里注册
              </a>
            </p>
          </div>
          <Form form={form}>
            <div className="mt-8 space-y-6">
              <Form.Field name="remember" initialValue={true}>
                <input type="hidden" name="remember" />
              </Form.Field>
              <Form.Field name="csrfToken" initialValue={props.csrfToken}>
                <input type="hidden" name="csrfToken" />
              </Form.Field>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    邮箱
                  </label>
                  <Form.Field name="email">
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="邮箱"
                    />
                  </Form.Field>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    密码
                  </label>
                  <Form.Field name="password">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="密码"
                    />
                  </Form.Field>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    忘记密码
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={loginAccount}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-green-500 group-hover:text-green-400"
                      aria-hidden="true"
                    />
                  </span>
                  登录
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
