import { type DownloaderInfo, type URLType } from 'electron/types/downloader'
import { DonwloaderBase } from './base'

export class Downloader extends DonwloaderBase {
  public downloaderInfo: DownloaderInfo

  constructor (
    private readonly url: string,
    private readonly title: string,
    donwloadPath?: string
  ) {
    super(donwloadPath)
    this.downloaderInfo = this.initDownloaderInfo(url)
  }

  private initDownloaderInfo (url: string): DownloaderInfo {
    const urlType = this.checkURLType(url)

    if (urlType === 'unknown') {
      return {
        type: 'unknown',
        title: this.title
      }
    }

    return {
      type: urlType,
      title: this.title,
      id: this.getID(url)
    }
  }

  private getID (url: string): string {
    const id = url.split('/').pop()
    if (id === undefined) {
      throw new Error('Invalid URL')
    }

    return id
  }

  private checkURLType (url: string): URLType {
    const liveRegex = /https:\/\/chzzk\.naver\.com\/live\/[^/]+/gm
    const clipRegex = /https:\/\/chzzk\.naver\.com\/embed\/clip\/[^/]+/gm
    const voidRegex = /https:\/\/chzzk\.naver\.com\/video\/[^/]+/gm

    if (liveRegex.test(url)) {
      return 'live'
    }

    if (clipRegex.test(url)) {
      return 'clip'
    }

    if (voidRegex.test(url)) {
      return 'vod'
    }

    return 'unknown'
  }

  start (): void {
  }

  public downloadLive (): void {

  }

  public downloadClip (): void {
    console.log('Download Clip')
  }

  public downloadVod (): void {
    console.log('Download Vod')
  }
}
