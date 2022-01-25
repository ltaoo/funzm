/**
 * @file 用户注册
 */
import { useCallback } from "react";
import Form from "rc-field-form";
import Head from "next/head";
import { useRouter } from "next/router";

import { LogoIcon } from "@ltaoo/icons/outline";

import { register } from "@/services/auth";
import { tabTitle } from "@/utils";
import { SLOGAN } from "@/constants";

const UserRegisterPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const registerAccount = useCallback(async () => {
    const values = await form.validateFields();
    await register(values);

    router.push({
      pathname: "/dashboard",
    });
  }, []);

  return (
    <>
      <Head>
        <title>{tabTitle("注册")}</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-100 w-full space-y-8 py-12 px-8 bg-white rounded shadow-xl">
            <div className="flex justify-center">
              <div className="#logo flex items-center text-center">
                <LogoIcon className="w-12 h-12 text-green-600" />
                <h2 className="ml-2 text-center text-3xl font-extrabold text-green-600">
                  趣字幕
                </h2>
              </div>
            </div>
            <div className="text-center font-extrabold text-green-600">
              {SLOGAN}
            </div>
            <Form form={form} autoComplete="off">
              <div className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      邮箱
                    </label>
                    <Form.Field name="email" initialValue="">
                      <input
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                        placeholder="邮箱"
                      />
                    </Form.Field>
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      密码
                    </label>
                    <Form.Field name="password" initialValue="">
                      <input
                        type="password"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                        placeholder="字母、数字或者英文符号，最短8位，区分大小写"
                      />
                    </Form.Field>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    注册即表示同意
                    <a className="font-medium text-green-600 hover:text-green-500">
                      《用户协议》
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    onClick={registerAccount}
                  >
                    注册
                  </button>
                </div>
              </div>
            </Form>
            <p className="mt-2 text-sm text-gray-600">
              已有账号？
              <a
                className="font-medium text-green-600 hover:text-green-500 cursor-pointer"
                href="/user/login"
              >
                前往登录
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRegisterPage;
