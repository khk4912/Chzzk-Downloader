// import { type DownloaderInfo } from 'electron/types/downloader'

import { type ChannelInfo, type LivePlaybackJSON, type LiveDetail } from '../types/api'
import { M3U8Downloader } from './base'
import { getDefaultDownloadPath } from '../utils/download_path'
import { _fetch as fetch } from '../utils/fetcher'

export class VODDownloader {
  /**
   *
   * @param url 채널 URL 또는 라이브 URL
   * @param downloadPath 파일의 다운로드 경로 (기본값: ~/Downloads or C:\Users\{사용자명}\Downloads)
   */

  // private readonly url: string
  // private readonly id: string

  private readonly channelInfo: ChannelInfo | null = null
  private liveDetail: LiveDetail | null = null
  private M3U8Downloader: M3U8Downloader | null = null

  private ready: boolean = false

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

    void this.init(id, downloadPath)
  }

  async init (id: string, downloadPath: string | undefined): Promise<void> {
    // const channelInfo = await this.getChannelInfo(id)
    // if (!channelInfo.content.openLive) {
    //   throw new Error('This channel is not live')
    // }

    // this.channelInfo = channelInfo

    const liveInfo = await this.getLiveInfo(id)
    if (liveInfo.content.status !== 'OPEN') {
      throw new Error('This channel is not live')
    }

    this.liveDetail = liveInfo

    const livePlaybackJSON = this.getLivePlaybackJSON(id)

    const playlistURL = livePlaybackJSON.media.find(
      media =>
        media.mediaId === 'LLHLS')
      ?.path ?? ''

    if (playlistURL === '') {
      throw new Error('Invalid live playback JSON')
    }

    this.M3U8Downloader = new M3U8Downloader(playlistURL, liveInfo.content.liveTitle, downloadPath ?? getDefaultDownloadPath())
    this.ready = true
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
    const data = await fetch(`https://api.chzzk.naver.com/polling/v3/channels/${id}`)

    if (data.status !== 200) {
      throw new Error('Invalid ID')
    }

    return await data.json()
  }

  private async getLiveInfo (id: string): Promise<LiveDetail> {
    console.log(id)
    const data = await fetch(`https://api.chzzk.naver.com/service/v3/channels/${id}/live-detail`)

    if (data.status !== 200) {
      throw new Error('Invalid ID')
    }

    return await data.json()
  }

  private getLivePlaybackJSON (id: string): LivePlaybackJSON {
    if (this.liveDetail === null) {
      throw new Error('Live detail is not loaded')
    }
    return JSON.parse(this.liveDetail.content.livePlaybackJson)
  }

  private async waitForReady (): Promise<void> {
    const MAX_WAIT = 3000
    let count = 0

    await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.ready) {
          clearInterval(interval)
          resolve(null)
        }

        if (count >= MAX_WAIT) {
          clearInterval(interval)
          reject(new Error('Timeout'))
        }

        count++
      }, 100)
    })
  }

  start (): void {
    this.waitForReady().then(() => {
      if (this.M3U8Downloader === null) {
        return
      }

      this.M3U8Downloader.start()
    }).catch(err => {
      console.error(err)
    })
  }
}
