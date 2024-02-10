import * as S3 from 'aws-sdk/clients/s3';
import { Logger, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class FileUploadService {
  async upload(name, file) {
    const { originalname } = file;
    const bucketS3 = 'my-task-management-app';
    const result = await this.uploadS3(
      file.buffer,
      bucketS3,
      name ? name : originalname,
    );
    return result;
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
