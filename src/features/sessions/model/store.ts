import { create } from 'zustand'
import type { SessionConnectData } from './types'

type Action = {
    setAuctionId: (auctionId: SessionConnectData['auctionId']) => void
    setAuctionAuthId: (auctionAuthId: SessionConnectData['auctionAuthId']) => void
    setWidth: (width: SessionConnectData['width']) => void
    setHeight: (height: SessionConnectData['height']) => void
}

export const useSession = create<SessionConnectData & Action>((set) => ({
    auctionId: '',
    auctionAuthId: '',
    width: 0,
    height: 0,
    setAuctionId: (auctionId) => set(() => ({ auctionId: auctionId })),
    setAuctionAuthId: (auctionAuthId) => set(() => ({ auctionAuthId: auctionAuthId })),
    setWidth: (width) => set(() => ({ width: width })),
    setHeight: (height) => set(() => ({ height: height })),
}))