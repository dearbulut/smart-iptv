import { create } from 'zustand';
import { IChannel } from '@/types';

interface ChannelStore {
  selectedChannel: IChannel | null;
  setSelectedChannel: (channel: IChannel | null) => void;
}

const useChannelStore = create<ChannelStore>((set) => ({
  selectedChannel: null,
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));

export { useChannelStore };
