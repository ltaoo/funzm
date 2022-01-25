import { ReadStream, unlinkSync } from "fs";

import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import { v4 as uuid } from "uuid";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { uploadFile, uploadStream } from "@/lib/utils/upload";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function provideUploadService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);

  const file: { filepath: string; originalFilename: string } =
    await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve(files.file);
      });
    });

  const { filepath, originalFilename } = file;

  const suffix = originalFilename.split(".").pop();

  const uploadedFile = await uploadFile(filepath, {
    key: `avatars/${uuid()}.${suffix}`,
  });
  await unlinkSync(filepath);
  resp(uploadedFile, res);
}
