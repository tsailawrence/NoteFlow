/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import aws from 'aws-sdk';

const { S3_BUCKET_REGION } = process.env;

aws.config.update({
  region: S3_BUCKET_REGION,
  credentials: new aws.CredentialProviderChain(), // 自動更新憑證 from cli
  // credentials: new aws.Credentials({
  //   accessKeyId: '...',
  //   secretAccessKey: '...',
  //   sessionToken: '...',
  // }),
});

const s3 = new aws.S3();

s3.listBuckets((err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Bucket List:', data.Buckets);
  }
});
