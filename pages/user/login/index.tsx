/**
 * @file 用户登录
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Form from "rc-field-form";

import { LogoIcon } from "@ltaoo/icons/outline";

// import { getCsrfToken, signin } from "@/next-auth/client";
import Loading from "@/components/Loading";
import { sleep, tabTitle } from "@/utils";
import { SLOGAN } from "@/constants";
import { login } from "@/services/auth";
import WeappLoginModal from "@/components/WeappLoginModal";

const UserLoginPage = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  // console.log("[PAGE]user.login", props);

  const loginAccount = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }
    setLoading(true);
    try {
      const values = await form.validateFields();
      const { email, password, csrfToken } = values;
      // console.log(email, password, csrfToken);
      await Promise.all([
        login({
          email,
          password,
          csrfToken,
          // redirect: false,
        }),
        sleep(2000),
      ]);
      router.replace({
        pathname: "/dashboard",
      });
      return;
    } catch (err) {
      alert(err.message);
      // message.error(err.message);
    }
    setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>{tabTitle("登录")}</title>
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
            <Form form={form}>
              <div className="mt-8 space-y-6">
                {/* <Form.Field name="csrfToken" initialValue={props.csrfToken}>
                  <input type="hidden" name="csrfToken" />
                </Form.Field> */}
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      邮箱
                    </label>
                    <Form.Field
                      name="email"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "请输入邮箱",
                      //   },
                      // ]}
                      initialValue=""
                    >
                      <input
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                        autoComplete="email"
                        placeholder="邮箱"
                      />
                    </Form.Field>
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      密码
                    </label>
                    <Form.Field
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "请输入密码",
                        },
                      ]}
                      initialValue=""
                    >
                      <input
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                        type="password"
                        autoComplete="current-password"
                        placeholder="密码"
                      />
                    </Form.Field>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a
                      href="/user/forgot"
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
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                    登录
                  </button>
                </div>
              </div>
            </Form>
            <p className="mt-2 text-sm text-gray-600">
              没有账号？
              <a
                href="/user/register"
                className="font-medium text-green-600 hover:text-green-500"
              >
                点击这里注册
              </a>
            </p>

            <WeappLoginModal>
              <div className="mt-4 text-sm text-gray-500 cursor-pointer">小程序登录</div>
            </WeappLoginModal>
          </div>
        </div>
        <Loading visible={loading} />
      </div>
    </>
  );
};

export default UserLoginPage;

// export async function getServerSideProps(context) {
//   const csrfToken = await getCsrfToken(context);
//   return {
//     props: { csrfToken },
//   };
// }
