import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import {
  useChannelService,
  useEPGService,
  useFavoritesService,
  useXtreamService,
} from '@/contexts/ServiceContext';
import { IChannel, IEPGProgram } from '@/types';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import ChannelList from '@/components/ChannelList/ChannelList';
import EPGGrid from '@/components/EPG/EPGGrid';
import Loading from '@/components/Loading/Loading';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface LiveTVProps {
  onBack: () => void;
  onChannelSelect: (channel: IChannel) => void;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const PlayerContainer = styled.div`
  grid-column: 2;
  grid-row: 1;
  position: relative;
  background-color: ${({ theme }) => theme.colors.black};
`;

const LiveTV: React.FC<LiveTVProps> = ({ onBack, onChannelSelect }) => {
  const channelService = useChannelService();
  const epgService = useEPGService();
  const favoritesService = useFavoritesService();
  const xtreamService = useXtreamService();

  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
  const [currentProgram, setCurrentProgram] = useState<IEPGProgram | null>(null);

  const { data: channels, isLoading, error } = useQuery({
    queryKey: ['channels'],
    queryFn: () => channelService.getChannels(),
  });

  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, [channels, selectedChannel]);

  const handleChannelSelect = (channel: IChannel) => {
    setSelectedChannel(channel);
    onChannelSelect(channel);
  };

  const handleFavoriteToggle = () => {
    if (!selectedChannel) return;

    if (favoritesService.isFavorite(selectedChannel)) {
      favoritesService.removeFavorite(selectedChannel);
    } else {
      favoritesService.addFavorite(selectedChannel);
    }
  };

  const handleEPGSelect = async (program: IEPGProgram) => {
    setCurrentProgram(program);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} onRetry={onBack} />;
  }

  if (!channels) {
    return <ErrorMessage error={new Error('No channels found')} onRetry={onBack} />;
  }

  return (
    <Container>
      <ChannelList
        channels={channels}
        selectedChannel={selectedChannel}
        onChannelSelect={handleChannelSelect}
        onBack={onBack}
      />
      <PlayerContainer>
        {selectedChannel && (
          <VideoPlayer
            src={xtreamService.getLiveStreamUrl(selectedChannel.streamId)}
            autoPlay
            onError={(error) => console.error('Video error:', error)}
          />
        )}
        {selectedChannel && (
          <EPGGrid
            channels={[selectedChannel]}
            onChannelSelect={handleChannelSelect}
            onProgramSelect={handleEPGSelect}
          />
        )}
      </PlayerContainer>
    </Container>
  );
};

export default LiveTV;
