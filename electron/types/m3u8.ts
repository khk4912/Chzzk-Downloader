// https://datatracker.ietf.org/doc/html/rfc8216#section-4.3.1.1
export interface M3U8Playlist {
  version: number // EXT-X-VERSION
  segments: SegementInfo[] // EXTINF
}

export interface SegementInfo {
  codecs: string
  bandwidth: number
  resolution: string
  url: string
}
