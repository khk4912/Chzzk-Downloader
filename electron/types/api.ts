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
  channel: MinChannelInfo
  livePollingStatusJson: string
  userAdultStatus: string | null
  chatDonationRankingExposure: boolean
  adParameter: AdParameter
}

interface MinChannelInfo {
  channelId: string
  channelName: string
  channelImageUrl: string
  verifiedMark: boolean
}

interface AdParameter {
  tag: string
}

export interface ChannelInfo {
  code: number
  message: string | null
  content: {
    channelId: string
    channelName: string
    channelImageUrl: string
    verifiedMark: boolean
    channelType: string
    channelDescription: string
    followerCount: number
    openLive: boolean
    subscriptionAvailability: boolean
    subscriptionPaymentAvailability: {
      iapAvailability: boolean
      iabAvailability: boolean
    }
    adMonetizationAvailability: boolean
  }
}

export interface LiveInfo {
  code: number
  message: string | null
  content: {
    liveTitle: string
    status: string
    concurrentUserCount: number
    accumulateCount: number
    paidPromotion: boolean
    adult: boolean
    clipActive: boolean
    chatChannelId: string
    tags: string[]
    categoryType: string
    liveCategory: string
    liveCategoryValue: string
    livePollingStatusJson: string
    faultStatus: string | null
    userAdultStatus: string
    chatActive: boolean
    chatAvailableGroup: string
    chatAvailableCondition: string
    minFollowerMinute: number
    chatDonationRankingExposure: boolean
  }
}
