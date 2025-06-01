import { EnvService } from '@/env/env.service'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

@Injectable()
export class S3Storage {
  private client: S3Client

  constructor(private env: EnvService) {
    this.client = new S3Client({
      endpoint: this.env.get('S3_ENDPOINT'),
      region: 'auto',
      credentials: {
        accessKeyId: this.env.get('S3_ACCESS_KEY'),
        secretAccessKey: this.env.get('S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = crypto.randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('S3_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
        ACL: 'public-read-write',
      }),
    )

    return {
      url: `http://localhost:9000/${this.env.get('S3_BUCKET_NAME')}/${uniqueFileName}`,
    }
  }

  async delete(fileName: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.env.get('S3_BUCKET_NAME'),
        Key: fileName,
      }),
    )
  }
}
