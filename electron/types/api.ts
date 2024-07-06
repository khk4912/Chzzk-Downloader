export interface LiveDetail {
  code: number
  message: string | null
  content: {
    liveId: number
    liveTitle: string
    status: string
    liveImageUrl: string
    defaultThumbnailImageUrl: string
    concurrentUserCount: number
    accumulateCount: number
    openDate: string
    closeDate: string
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
    channel: {
      channelId: string
      channelName: string
      channelImageUrl: string
      verifiedMark: boolean
    }
    livePollingStatusJson: string
    userAdultStatus: unknown
    blindType: unknown
    chatDonationRankingExposure: boolean
    adParameter: {
      tag: string
    }
  }
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

export interface LivePlaybackJSON {
  meta: {
    videoId: string
    streamSeq: number
    liveId: string
    paidLive: boolean
    cdnInfo: {
      cdnType: string
      zeroRating: boolean
    }
    p2p: boolean
    cmcdEnabled: boolean
  }
  serviceMeta: {
    contentType: string
  }
  live: {
    start: string
    open: string
    timeMachine: boolean
    status: string
  }
  api: Array<{
    name: string
    path: string
  }>
  media: Array<{
    mediaId: string
    protocol: string
    path: string
    encodingTrack: unknown[]
    latency?: string
  }>
  thumbnail: {
    snapshotThumbnailTemplate: string
    types: string[]
  }
  multiview: unknown[]
}
