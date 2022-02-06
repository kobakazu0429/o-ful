import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";
import { IncomingForm } from "formidable";
import type { Fields, Files } from "formidable";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await new Promise<{
      fields: Fields;
      files: Files;
    }>((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const files = Object.keys(data.files).map(
      // @ts-expect-error
      (key) => data.files[key].filepath
    );
    const response = await Promise.all(
      files.map((file) =>
        cloudinary.v2.uploader.upload(file, { folder: "o-ful" })
      )
    );

    return res.json(response);
  } catch (error) {
    return res.json(error);
  }
}
