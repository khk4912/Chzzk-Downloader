import { getDefaultDownloadPath } from 'electron/utils/download_path'

export class DonwloaderBase {
  private readonly ready: boolean = false
  private readonly downloadPath: string

  constructor (downloadPath?: string) {
    this.downloadPath = downloadPath ?? getDefaultDownloadPath()
  }
}
