import * as AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_S3_REGION,
});

const Bucket = "nomadcoffee-uploads-challenge";
const bucketInstance = new AWS.S3();

export const uploadToS3 = async (
  file: any,
  username: string,
  foldername: string
) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objName = `${username}/${foldername}/${Date.now()}-${filename}`;
  const { Location } = await bucketInstance
    .upload({
      Bucket,
      Key: objName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};

export const deleteS3 = async (
  fileUrl: string,
  username: string,
  foldername: string
) => {
  const filePath = fileUrl.split(`/${foldername}/`)[1];
  const params = {
    Bucket,
    Key: `${username}/${foldername}/${decodeURI(filePath)}`,
  };
  await bucketInstance
    .deleteObject(params, (error, data) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log("deleted");
      }
    })
    .promise();
};
