interface Upload {
  fileName: string
  url: string
}
interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}
export class FakeUploader {
  public uploads: Upload[] = []
  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = crypto.randomUUID()
    this.uploads.push({
      fileName,
      url,
    })
    return { url }
  }
}
