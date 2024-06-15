import { type M3U8Playlist } from 'electron/types/m3u8'

enum M3U8Tag {
  VERSION = '#EXT-X-VERSION',
  INF = '#EXT-X-STREAM-INF',

}

export function parseM3U8 (data: string): M3U8Playlist {
  const lines = data.split('\n')
  const playlist: M3U8Playlist = {
    version: 0,
    segments: []
  }

  while (lines.length > 0) {
    const line = lines.shift() ?? ''

    if (line.startsWith(M3U8Tag.VERSION)) {
      playlist.version = parseInt(line.split(':')[1])
    } else if (line.startsWith(M3U8Tag.INF)) {
      const info = line.split(':')[1]

      const bandwidth = info.match(/BANDWIDTH=(\d+)/)?.[1]
      const resolution = info.match(/RESOLUTION=(\d+x\d+)/)?.[1]
      const codecs = info.match(/CODECS="([^"]+)"/)?.[1]

      const url = lines.shift() ?? ''

      if (bandwidth === undefined || resolution === undefined ||
         codecs === undefined) {
        continue
      }

      playlist.segments.push({
        bandwidth: parseInt(bandwidth),
        resolution,
        codecs,
        url
      })
    }
  }

  return playlist
}
