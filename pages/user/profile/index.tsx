/**
 * @file 用户详情
 */
import { useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Form, { Field } from "rc-field-form";
import Upload from "rc-upload";

import Layout from "@/layouts";
import { tabTitle } from "@/utils";
import { useUser } from "@/domains/user/hooks";
import { updateUserProfileService } from "@/services/user";
import { uploadFileService } from "@/services/upload";
import Avatar from "@/components/Avatar";

const UserProfilePage = () => {
  // const [session] = useSession();
  const user = useUser();

  const router = useRouter();
  const [form] = Form.useForm();

  const updateProfile = useCallback(async () => {
    const values = await form.validateFields();
    await updateUserProfileService(values);
    alert("更新成功");
  }, []);

  const handleUploadFile = useCallback(async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    const { url } = await uploadFileService(formData);
    form.setFieldsValue({ avatar: url });
  }, []);

  if (user === null) {
    return null;
  }

  console.log("[PAGE]user/profile - render", user);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>{tabTitle("修改个人信息")}</title>
        </Head>
        <div className="">
          <Form form={form}>
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    昵称
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <Field name="nickname" initialValue={user.nickname}>
                      <input
                        type="text"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        placeholder="你的昵称"
                      />
                    </Field>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700"
                >
                  About
                </label>
                <div className="mt-1">
                  <Field name="about" initialValue="">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  头像
                </label>
                <div className="mt-1 flex items-center">
                  <Field name="avatar" initialValue={user?.avatar}>
                    <div />
                  </Field>
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <Avatar url={user?.avatar} />
                  </span>
                  <Upload customRequest={handleUploadFile}>
                    <button
                      type="button"
                      className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      上传
                    </button>
                  </Upload>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={updateProfile}
                >
                  保存
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
