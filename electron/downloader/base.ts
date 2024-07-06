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

  /**
   * URL에서 데이터를 다운로드합니다.
   *
   * @param url 다운로드할 URL
   * @returns 다운로드 된 데이터
   */
  protected async download (url: string | URL): Promise<Uint8Array> {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    return new Uint8Array(buffer)
  }

  /**
   * 다운로드 된 데이터들을 파일에 작성합니다.
   *
   * @param chunks 다운로드 된 데이터
   */
  protected async writeChunks (chunks: Array<PromiseSettledResult<Uint8Array>>): Promise<void> {
    for (const chunk of chunks) {
      if (chunk.status === 'fulfilled') {
        await fs.appendFile(`${this.downloadPath}/${this.fileName}.mp4`, chunk.value)
      }
    }
  }
}

export class M3U8Downloader extends DownloaderBase {
  private readonly playlistURL: URL
  private readonly ready: boolean = false

  private isRunning: boolean = false

  private mediaSequence = -1
  private targetChunkListURL: URL | null = null
  private duplicatedCounts: number = 0

  constructor (playlistURL: string, fileName: string, downloadPath?: string) {
    super(fileName, downloadPath)
    this.playlistURL = new URL(playlistURL)

    setOptions({
      silent: true
    })
  }

  /**
   * 다운로드를 시작합니다.
   */
  start (): void {
    this.isRunning = true
    this.run().then().catch(e => { console.error(e) })
  }

  /**
   * 다운로드를 중지합니다.
   */
  stop (): void {
    this.isRunning = false
  }

  async run (): Promise<void> {
    if (!this.ready) {
      await this.init()
    }

    while (this.isRunning) {
      const medianum = this.mediaSequence
      await this.downloadChunks()
      console.log(`#${medianum} -> ${this.mediaSequence}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
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

  /**
   * Base MP4 파일을 다운로드하고 파일에 씁니다.
   *
   * @param parsedPlaylist 파싱된 MediaPlaylist
   * @param url ChunkList URL
   */
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
    const bytes = await this.download(new URL(`./${baseMP4URL}`, url))
    await fs.writeFile(`${this.downloadPath}/${this.fileName}.mp4`, bytes)
  }

  /**
   * Chunk들을 다운로드하고 파일에 씁니다.
   */
  private async downloadChunks (): Promise<void> {
    if (this.targetChunkListURL === null) {
      throw new Error('targetChunkListURL is null!')
    }

    // Media Sequence 업데이트
    this.targetChunkListURL.searchParams
      .set('_HLS_msn', this.mediaSequence.toString())

    console.log('Request URL: ', this.targetChunkListURL)

    const response = await fetch(this.targetChunkListURL)
    const playlist = await response.text()

    const parsedPlaylist = parse(playlist)

    if (!(parsedPlaylist instanceof MediaPlaylist)) {
      throw new Error('Invalid playlist!')
    }

    const tasks: Array<Promise<Uint8Array>> = []
    let newMediaSequence = this.mediaSequence
    console.log(`Before: ${newMediaSequence}`)
    for (const segment of parsedPlaylist.segments) {
      for (const partial of segment.parts) {
        if (!this.checkSegmentSequence(segment.mediaSequenceNumber)) {
          continue
        }

        newMediaSequence = segment.mediaSequenceNumber
        tasks.push(this.download(
          new URL(
            `./${partial.uri}`,
            this.targetChunkListURL)
        ))
      }
    }
    console.log(`After: ${newMediaSequence}`)

    const datas = await Promise.allSettled(tasks)
    await this.writeChunks(datas)

    this.handleDupSegmentSequence(newMediaSequence)
    this.mediaSequence = newMediaSequence
  }

  private checkSegmentSequence (segmentSequenceNumber: number): boolean {
    if (segmentSequenceNumber <= this.mediaSequence) {
      return false
    }
    return true
  }

  private handleDupSegmentSequence (segmentSequenceNumber: number): void {
    if (segmentSequenceNumber === this.mediaSequence) {
      this.duplicatedCounts++

      if (this.duplicatedCounts >= 10) {
        throw new Error('10 Duplicated Seq #')
      }
    } else {
      this.duplicatedCounts = 0
    }
  }
}
