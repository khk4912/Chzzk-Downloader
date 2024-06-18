// import { type DownloaderInfo } from 'electron/types/downloader'
import { DownloaderBase } from './base'

export class VODDownloader extends DownloaderBase {
  // public downloaderInfo: DownloaderInfo

  /**
   *
   * @param url Live-Detail의 URL
   * @param downloadPath 파일의 다운로드 경로 (기본값: ~/Downloads or C:\Users\{사용자명}\Downloads)
   */
  constructor (
    url: string,
    downloadPath?: string
  ) {
    super(url, 'test', downloadPath)

    console.log('init')
    // this.downloaderInfo = this.init(url)
  }

  start (): void {
  }
}
