import { parse, setOptions } from 'hls-parser'

import { getDefaultDownloadPath } from '../utils/download_path'
import { promises as fs } from 'fs'
import { MediaPlaylist } from 'hls-parser/types'

/* TODO: VOD / 클립 / 생방송 다운로드, DownloaderBase 이용해서 각자 만들고 추상화.
   Downloader 클래스는 위 클래스의 Wrapper로 작동하도록 할    */

export class DownloaderBase {
  protected readonly fileName: string
  protected readonly downloadPath: string

  /**
   *
   * @param fileName 파일의 저장이름
   * @param downloadPath 파일의 다운로드 경로 (기본값: ~/Downloads or C:\Users\{사용자명}\Downloads)
   */
  constructor (fileName: string, downloadPath?: string) {
    this.fileName = fileName
    this.downloadPath = downloadPath ?? getDefaultDownloadPath()
  }

  protected async downloadAndWrite (url: string, filePath: string): Promise<void> {
    const response = await fetch(url)
    const reader = response.body?.getReader()

    if (reader === undefined) {
      throw new Error('Failed to get reader')
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      await fs.appendFile(filePath, value)
    }
  }
}

export class M3U8Downloader extends DownloaderBase {
  private readonly playlistURL: string
  private mediaSequence = -1

  private readonly ready: boolean = false
  private isRunning: boolean = false

  constructor (playlistURL: string, fileName: string, downloadPath?: string) {
    super(fileName, downloadPath)
    this.playlistURL = playlistURL

    setOptions({
      silent: true
    })
  }

  start (): void {
    this.isRunning = true
    this.run().then().catch(e => e)
  }

  stop (): void {
    this.isRunning = false
  }

  async run (): Promise<void> {
    if (!this.ready) {
      await this.init()
    }

    while (this.isRunning) {
      // Sth more to do
    }
  }

  async init (): Promise<void> {
    const response = await fetch(this.playlistURL)
    const playlist = await response.text()
    const parsedPlaylist = parse(playlist)

    if (!(parsedPlaylist instanceof MediaPlaylist)) {
      throw new Error('Failed to parse playlist')
    }

    this.mediaSequence = parsedPlaylist.mediaSequenceBase ?? -1
    if (this.mediaSequence === -1) {
      throw new Error('Failed to get media sequence')
    }
  }
}

// const x = new M3U8Downloader('https://livecloud.pstatic.net/chzzk/lip2_kr/cflexnmss2u0007/cl0t7kloor6nrqt0fasllad13flkvpicad/hdntl=exp=1718754185~acl=*%2Fcl0t7kloor6nrqt0fasllad13flkvpicad%2F*~data=hdntl~hmac=c057e8a624e9f4e84af0dd14283148c6b99209627fc6fcdb5002f544a64a22ee/chunklist_1080p.m3u8?_HLS_msn=10329&_HLS_part=1', 'asdf')

/*
private getID (url: string): string {
  const id = url.split('/').pop()
  if (id === undefined) {
    throw new Error('Invalid URL')
  }

  return id
}

private checkURLType (url: string): URLType {
  const liveRegex = /https:\/\/chzzk\.naver\.com\/live\/[^/]+/gm
  const clipRegex = /https:\/\/chzzk\.naver\.com\/embecdd\/clip\/[^/]+/gm
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
*/
