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

      if (bandwidth !== undefined && resolution !== undefined &&
         codecs !== undefined) {
        playlist.segments.push({
          bandwidth: parseInt(bandwidth),
          resolution,
          codecs,
          url
        })
      }
    }
  }

  return playlist
}

console.log(parseM3U8(`
#EXTM3U
#EXT-X-VERSION:7
#EXT-X-INDEPENDENT-SEGMENTS

#EXT-X-STREAM-INF:BANDWIDTH=8192000,CODECS="avc1.64002A,mp4a.40.2",RESOLUTION=1920x1080
hdntl=exp=1718476199~acl=*%2Fgfmhjvg9xagftd46gpkxp9yr2lcxryjz5g%2F*~data=hdntl~hmac=42e84573b4e6f2016118890705aa3c1ac2e968102ac436c6c4792875075bbcf4/hls_chunklist_1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5192000,CODECS="avc1.640028,mp4a.40.2",RESOLUTION=1280x720
hdntl=exp=1718476199~acl=*%2Fgfmhjvg9xagftd46gpkxp9yr2lcxryjz5g%2F*~data=hdntl~hmac=42e84573b4e6f2016118890705aa3c1ac2e968102ac436c6c4792875075bbcf4/hls_chunklist_720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1692000,CODECS="avc1.4D001F,mp4a.40.2",RESOLUTION=852x480
hdntl=exp=1718476199~acl=*%2Fgfmhjvg9xagftd46gpkxp9yr2lcxryjz5g%2F*~data=hdntl~hmac=42e84573b4e6f2016118890705aa3c1ac2e968102ac436c6c4792875075bbcf4/hls_chunklist_480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=992000,CODECS="avc1.4D001E,mp4a.40.2",RESOLUTION=640x360
hdntl=exp=1718476199~acl=*%2Fgfmhjvg9xagftd46gpkxp9yr2lcxryjz5g%2F*~data=hdntl~hmac=42e84573b4e6f2016118890705aa3c1ac2e968102ac436c6c4792875075bbcf4/hls_chunklist_360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=192000,CODECS="avc1.4D000C,mp4a.40.2",RESOLUTION=256x144
hdntl=exp=1718476199~acl=*%2Fgfmhjvg9xagftd46gpkxp9yr2lcxryjz5g%2F*~data=hdntl~hmac=42e84573b4e6f2016118890705aa3c1ac2e968102ac436c6c4792875075bbcf4/hls_chunklist_144p.m3u

`))
