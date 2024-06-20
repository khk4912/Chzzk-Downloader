// import { type DownloaderInfo } from 'electron/types/downloader'

import { type LiveInfo, type ChannelInfo } from 'electron/types/api'
import { M3U8Downloader } from './base'

export class VODDownloader {
  /**
   *
   * @param url 채널 URL 또는 라이브 URL
   * @param downloadPath 파일의 다운로드 경로 (기본값: ~/Downloads or C:\Users\{사용자명}\Downloads)
   */

  // private readonly url: string
  // private readonly id: string

  private channelInfo: ChannelInfo | null = null
  private liveInfo: LiveInfo | null = null
  private readonly ready: boolean = false

  constructor (
    url: string,
    downloadPath?: string
  ) {
    if (!this.checkURL(url)) {
      throw new Error('Invalid URL')
    }

    const id = this.getID(url)
    if (id === '') {
      throw new Error('Invalid URL')
    }

    this.init(id).catch((e: unknown) => { throw e })
  }

  async init (id: string): Promise<void> {
    const channelInfo = await this.getChannelInfo(id)
    if (!channelInfo.content.openLive) {
      throw new Error('This channel is not live')
    }

    this.channelInfo = channelInfo

    const liveInfo = await this.getLiveInfo(id)
    if (liveInfo.content.status !== 'OPEN') {
      throw new Error('This channel is not live')
    }

    this.liveInfo = liveInfo
  }

  /**
   * URL이 유효(채널 또는 라이브 URL) 여부를 확인합니다.
   *
   * @param url 확인할 URL
   * @returns 유효하면 true, 그렇지 않으면 false
   */
  private checkURL (url: string): boolean {
    const liveURLReg = /https:\/\/chzzk\.naver\.com\/live\/[a-zA-Z0-9]+/gm
    const channelURLReg = /https:\/\/chzzk\.naver\.com\/[a-zA-Z0-9]+/gm

    return liveURLReg.test(url) || channelURLReg.test(url)
  }

  /**
   * URL에서 ID를 추출합니다.
   *
   * @param url ID를 추출할 URL
   * @returns 추출된 ID
   */
  private getID (url: string): string {
    return url.split('/').pop() ?? ''
  }

  /**
   * 채널 정보를 가져옵니다.
   *
   * @param id 채널 ID
   * @returns 채널 정보
   */
  private async getChannelInfo (id: string): Promise<ChannelInfo> {
    const data = await fetch(`https://api.chzzk.naver.com/service/v1/channels/${id}`)

    if (data.status !== 200) {
      throw new Error('Invalid ID')
    }

    return await data.json()
  }

  private async getLiveInfo (id: string): Promise<LiveInfo> {
    const data = await fetch(`https://api.chzzk.naver.com/service/v1/lives/${id}`)

    if (data.status !== 200) {
      throw new Error('Invalid ID')
    }

    return await data.json()
  }

  start (): void {
  }
}
