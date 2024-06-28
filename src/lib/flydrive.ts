import { Disk } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import { S3Driver } from "flydrive/drivers/s3";

const fs = new FSDriver({
  location: "./public/uploads",
  visibility: "public",
  urlBuilder: {
    async generateURL(key) {
      return Promise.resolve("/uploads/" + key);
    },
  },
});

export const fsDisk = new Disk(fs);

if (process.env.NODE_ENV === "production" && process.env.AWS_MODE !== "local") {
  process.env.AWS_ENDPOINT = undefined;
}
function getS3URL(key: string, bucket: string) {
  return process.env.AWS_ENDPOINT
    ? `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET}/${key}`
    : `https://${bucket}.s3.amazonaws.com/${key}`;
}

const s3Driver = new S3Driver({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true,
  bucket: process.env.AWS_BUCKET as string,
  visibility: "public",
  supportsACL: false, // keep this false
  urlBuilder: {
    generateURL: async (key: string, bucket: string) => {
      return Promise.resolve(getS3URL(key, bucket));
    },
  },
});

export const s3Disk = new Disk(s3Driver);
