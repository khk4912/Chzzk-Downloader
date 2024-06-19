import { parse, setOptions } from 'hls-parser'

import { getDefaultDownloadPath } from '../utils/download_path'
import { promises as fs } from 'fs'
import { MasterPlaylist, MediaPlaylist } from 'hls-parser/types'

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

  protected async downloadAndWrite (url: string | URL, filePath: string): Promise<void> {
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
    console.log('downloaded!')
  }
}

export class M3U8Downloader extends DownloaderBase {
  private readonly playlistURL: URL
  private readonly ready: boolean = false

  private isRunning: boolean = false

  private mediaSequence = -1
  private targetChunkListURL: URL | null = null

  constructor (playlistURL: string, fileName: string, downloadPath?: string) {
    super(fileName, downloadPath)
    this.playlistURL = new URL(playlistURL)

    setOptions({
      silent: true
    })
  }

  start (): void {
    this.isRunning = true
    this.run().then().catch(e => { console.error(e) })
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

  /**
   * M3U8 파일을 파싱하고, 가장 높은 품질의 URL을 찾아내어 targetChunkListURL에 저장합니다.
   * 그 후, targetChunkListURL을 이용하여 Media Sequence를 찾아내어 저장합니다.
   *
   * @returns Promise<void>
   */
  async init (): Promise<void> {
    const response = await fetch(this.playlistURL)
    const playlist = await response.text()
    const parsedPlaylist = parse(playlist)

    if (!(parsedPlaylist instanceof MasterPlaylist)) {
      throw new Error('Invalid playlist!')
    }

    const variants = parsedPlaylist.variants
    variants.sort((a, b) => a.bandwidth - b.bandwidth)

    const highestQuality = variants[variants.length - 1]
    const highestQualityURL = highestQuality.uri

    this.targetChunkListURL = new URL(`./${highestQualityURL}`, this.playlistURL)
    await this.initChunkList(this.targetChunkListURL)
  }

  /**
   * MediaSequence를  찾아내어 저장하고,
   * Base MP4 파일을 생성합니다.

   * @param url MediaPlaylist URL
   */
  private async initChunkList (url: URL): Promise<void> {
    const response = await fetch(url)
    const playlist = await response.text()
    const parsedPlaylist = parse(playlist)

    if (!(parsedPlaylist instanceof MediaPlaylist)) {
      throw new Error('Invalid playlist!')
    }

    this.mediaSequence = parsedPlaylist.mediaSequenceBase ?? -1
    await this.downloadBaseMP4(parsedPlaylist, url)
  }

  private async downloadBaseMP4 (parsedPlaylist: MediaPlaylist, url: URL): Promise<void> {
    let baseMP4URL = ''
    for (const line of parsedPlaylist.source?.split('\n') ?? []) {
      if (line.startsWith('#EXT-X-MAP')) {
        const regex = /#EXT-X-MAP:URI="(.+)"/gm
        const match = regex.exec(line)

        if (match?.[1] === undefined) {
          throw new Error('Failed to parse EXT-X-MAP')
        }

        baseMP4URL = match[1]
      }
    }
    await this.downloadAndWrite(new URL(`./${baseMP4URL}`, url), `${this.downloadPath}/${this.fileName}.mp4`)
  }
}
