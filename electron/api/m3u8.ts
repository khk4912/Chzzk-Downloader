import { type LiveDetail } from 'electron/types/api'

export async function getLiveDetail (channelID: string): Promise<LiveDetail> {
  const url = `https://api.chzzk.naver.com/service/v2/channels/${channelID}/live-detail`

  const response = await fetch(url)
  return await response.json()
}
