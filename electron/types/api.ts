export interface LiveDetail {
  liveId: number
  liveTitle: string
  status: string
  liveImageUrl: string
  defaultThumbnailImageUrl: string | null
  concurrentUserCount: number
  accumulateCount: number
  openDate: string
  closeDate: string | null
  adult: boolean
  clipActive: boolean
  tags: string[]
  chatChannelId: string
  categoryType: string
  liveCategory: string
  liveCategoryValue: string
  chatActive: boolean
  chatAvailableGroup: string
  paidPromotion: boolean
  chatAvailableCondition: string
  minFollowerMinute: number
  livePlaybackJson: string
  p2pQuality: string[]
  channel: ChannelInfo
  livePollingStatusJson: string
  userAdultStatus: string | null
  chatDonationRankingExposure: boolean
  adParameter: AdParameter
}

interface ChannelInfo {
  channelId: string
  channelName: string
  channelImageUrl: string
  verifiedMark: boolean
}

interface AdParameter {
  tag: string
}
