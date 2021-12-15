/**
 * @file 用户注册
 */
import { useCallback } from "react";
import Form from "rc-field-form";
import { LockClosedIcon } from "@heroicons/react/solid";

import Link from "next/link";
import { useRouter } from "next/router";

import { register } from "@/services/auth";

const RegisterPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const registerAccount = useCallback(async () => {
    const values = await form.validateFields();
    console.log(values);
    await register(values);
    // message.success("注册成功");
    router.push({
      pathname: "/user/login",
    });
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
      <Form form={form}>
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Register a new account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                已有账号？
                <a
                  className="font-medium text-green-600 hover:text-green-500 cursor-pointer"
                  href="/user/login"
                >
                  直接登录
                </a>
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <input type="hidden" name="remember" defaultValue="true" />
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
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="密码"
                    />
                  </Form.Field>
                </div>
              </div>
              <div className="flex items-center justify-between"></div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                  onClick={registerAccount}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-green-500 group-hover:text-green-400"
                      aria-hidden="true"
                    />
                  </span>
                  注册
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default RegisterPage;
