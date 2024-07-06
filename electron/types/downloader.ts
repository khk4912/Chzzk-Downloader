interface DonwloaderInfoBase {
  type: URLType
  title: string
  id?: string | undefined
  // streamer?: Streamer | undefined

  /* TODO: Add streamer info in the near future */
}

interface UnknownDownloaderInfo extends DonwloaderInfoBase {
  type: 'unknown'
  id?: undefined
}

interface ElseDownloaderInfo extends DonwloaderInfoBase {
  type: Exclude<URLType, 'unknown'>
  id: string
}

export type DownloaderInfo = UnknownDownloaderInfo | ElseDownloaderInfo

// interface Streamer {
//   url: string
//   id: string
//   name: string
// }

export type URLType = 'live' | 'clip' | 'vod' | 'unknown'

export interface ChannelInfo {
  id: string
  name: URL
  thubnailURL: string
}
