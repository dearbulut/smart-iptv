import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import TizenVideoPlayer from '@/components/VideoPlayer/TizenVideoPlayer';
import ChannelList from '@/components/Channel/ChannelList';
import EPGGrid from '@/components/EPG/EPGGrid';
import EPGReminderPopup from '@/components/EPG/EPGReminderPopup';
import MiniEPG from '@/components/EPG/MiniEPG';
import NumberInput from '@/components/Keyboard/NumberInput';

import ChannelInfoOverlay from '@/components/Channel/ChannelInfo';
import TizenHelp from '@/components/Help/TizenHelp';
import TizenSearch from '@/components/Search/TizenSearch';
import ChannelGroup from '@/components/Channel/ChannelGroup';
import ChannelFavorites from '@/components/Channel/ChannelFavorites';
import ChannelEdit from '@/components/Channel/ChannelEdit';
import ChannelSort from '@/components/Channel/ChannelSort';
import ChannelFilter from '@/components/Channel/ChannelFilter';
import ChannelSettings from '@/components/Channel/ChannelSettings';
import { ChannelHistory, ChannelHistoryManager } from '@/components/Channel/ChannelHistory';
import { IChannel, IEPGProgram } from '@/types';
import {
  useChannelService,
  useEPGService,
  useFavoritesService,
  useXtreamService,
} from '@/contexts/ServiceContext';
import { useTizenTV } from '@/hooks/useTizenTV';
import { useChannelStore } from '@/store/channel';
import { useNotificationStore } from '@/store/notification';

interface LiveTVProps {}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.colors.background.main};
`;

const PlayerContainer = styled.div`
  flex: 1;
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const HelpText = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1000;
`;

const LiveTV: React.FC<LiveTVProps> = () => {
  const xtreamService = useXtreamService();
  const channelService = useChannelService();
  const epgService = useEPGService();
  const favoritesService = useFavoritesService();
  const { addNotification } = useNotificationStore();
  const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const setSelectedChannel = useChannelStore((state) => state.setSelectedChannel);
  const [showEPG, setShowEPG] = useState(false);
  const [showMiniEPG, setShowMiniEPG] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [reminderProgram, setReminderProgram] = useState<IEPGProgram | null>(null);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000);
  const historyManager = ChannelHistoryManager.getInstance();

  // Initialize Tizen TV features
  useTizenTV({
    onKeyDown: (event) => {
      if (/^[0-9]$/.test(event.key)) {
        setShowNumberPad(true);
        return;
      }

      switch (event.keyCode) {
        case 457: // INFO key
          setShowChannelInfo((prev) => !prev);
          break;
        case 73: // I key
          if (currentProgram) {
            setShowMiniEPG((prev) => !prev);
          }
          break;
        case 69: // E key
          setShowEPG((prev) => !prev);
          break;
        case 72: // H key
          setShowHelp((prev) => !prev);
          break;
        case 83: // S key
          setShowSearch((prev) => !prev);
          break;
        case 71: // G key
          setShowGroups((prev) => !prev);
          break;
        case 70: // F key
          setShowFavorites((prev) => !prev);
          break;
        case 69: // E key
          if (selectedChannel) {
            setShowEdit(true);
          }
          break;
        case 79: // O key
          setShowSort(true);
          break;
        case 76: // L key
          setShowFilter(true);
          break;
        case 84: // T key
          if (selectedChannel) {
            setShowSettings(true);
          }
          break;
        case 80: // P key
          setShowHistory(true);
          break;
        case 10009: // RETURN key
          if (showEPG) {
            setShowEPG(false);
          } else if (showMiniEPG) {
            setShowMiniEPG(false);
          } else if (showNumberPad) {
            setShowNumberPad(false);
          } else if (showChannelInfo) {
            setShowChannelInfo(false);
          } else if (showHelp) {
            setShowHelp(false);
          } else if (showSearch) {
            setShowSearch(false);
          } else if (showGroups) {
            setShowGroups(false);
          } else if (showFavorites) {
            setShowFavorites(false);
          } else if (showEdit) {
            setShowEdit(false);
          } else if (showSort) {
            setShowSort(false);
          } else if (showFilter) {
            setShowFilter(false);
          } else if (showSettings) {
            setShowSettings(false);
          } else if (showHistory) {
            setShowHistory(false);
          }
          break;
        case 65: // A key
          if (selectedChannel) {
            const isFavorite = favoritesService.isFavorite(selectedChannel.streamId);
            if (isFavorite) {
              favoritesService.removeFavorite(selectedChannel.streamId);
              addNotification({
                message: `${selectedChannel.name} removed from favorites`,
                type: 'info',
              });
            } else {
              favoritesService.addFavorite(selectedChannel);
              addNotification({
                message: `${selectedChannel.name} added to favorites`,
                type: 'success',
              });
            }
          }
          break;
        default:
          break;
      }
    },
  });

  // Fetch channels and categories
  const { data: channels, isLoading: isLoadingChannels } = useQuery({
    queryKey: ['live-channels'],
    queryFn: () => channelService.getChannels(),
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['live-categories'],
    queryFn: () => channelService.getCategories(),
  });

  // Fetch EPG data for selected channel
  const { data: epgData } = useQuery({
    queryKey: ['epg', selectedChannel?.streamId],
    queryFn: async () => {
      if (!selectedChannel) return [];
      return epgService.getPrograms(selectedChannel.streamId.toString(), () =>
        xtreamService.getEPG(selectedChannel.streamId)
      );
    },
    enabled: !!selectedChannel,
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Find current and next program
  const getCurrentAndNextProgram = (programs: IEPGProgram[] = []): [IEPGProgram | undefined, IEPGProgram | undefined] => {
    const current = programs.find(
      (program) =>
        currentTime >= new Date(program.start).getTime() / 1000 &&
        currentTime < new Date(program.end).getTime() / 1000
    );

    const nextIndex = programs.findIndex((p) => p === current) + 1;
    const next = nextIndex < programs.length ? programs[nextIndex] : undefined;

    return [current, next];
  };

  const [currentProgram, nextProgram] = getCurrentAndNextProgram(epgData);

  // Calculate program progress
  const getProgramProgress = (program?: IEPGProgram): number => {
    if (!program) return 0;
    const start = new Date(program.start).getTime() / 1000;
    const end = new Date(program.end).getTime() / 1000;
    const duration = end - start;
    const elapsed = currentTime - start;
    return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  };

  if (isLoadingChannels || isLoadingCategories) {
    return <LoadingOverlay>Loading...</LoadingOverlay>;
  }

  const handleChannelSelect = (channel: IChannel) => {
    setSelectedChannel(channel);
    historyManager.addChannel(channel);
    addNotification({
      message: `Now playing: ${channel.name}`,
      type: 'info',
      duration: 2000,
    });
  };

  const handleNumberSelect = (number: number) => {
    const channel = channels?.find((c) => c.num === number);
    if (channel) {
      handleChannelSelect(channel);
      setShowNumberPad(false);
    } else {
      addNotification({
        message: `Channel ${number} not found`,
        type: 'warning',
        duration: 2000,
      });
    }
  };

  return (
    <Container>
      <ChannelList
        channels={channels || []}
        categories={categories || []}
        selectedChannelId={selectedChannel?.streamId}
        onChannelSelect={handleChannelSelect}
      />
      <PlayerContainer>
        {selectedChannel && (
          <TizenVideoPlayer
            src={xtreamService.getStreamUrl(selectedChannel)}
            autoPlay={true}
            initialVolume={0.8}
            initialQuality="auto"
            onError={(error) => {
              console.error('Video error:', error);
              addNotification({
                message: `Error playing ${selectedChannel.name}: ${error.message}`,
                type: 'error',
                duration: 5000,
              });
            }}
            onPlay={() => {
              addNotification({
                message: `Now playing: ${selectedChannel.name}`,
                type: 'success',
                duration: 2000,
              });
            }}
            onPause={() => {
              addNotification({
                message: `Paused: ${selectedChannel.name}`,
                type: 'info',
                duration: 2000,
              });
            }}
            onEnded={() => {
              addNotification({
                message: `Playback ended: ${selectedChannel.name}`,
                type: 'warning',
                duration: 2000,
              });
            }}
          />
        )}
        {showEPG && epgData && channels && (
          <EPGGrid
            programs={epgData}
            channels={channels}
            selectedChannelId={selectedChannel?.streamId}
            currentTime={currentTime}
            onClose={() => setShowEPG(false)}
            onChannelSelect={handleChannelSelect}
            onProgramSelect={(program) => {
              setReminderProgram(program);
            }}
          />
        )}
        {showMiniEPG && currentProgram && (
          <MiniEPG
            currentProgram={currentProgram}
            nextProgram={nextProgram}
            progress={getProgramProgress(currentProgram)}
          />
        )}
        {showNumberPad && (
          <NumberInput
            onNumber={handleNumberSelect}
            onClose={() => setShowNumberPad(false)}
            timeout={3000}
          />
        )}

        {showChannelInfo && selectedChannel && (
          <ChannelInfoOverlay
            channel={selectedChannel}
            currentProgram={currentProgram}
            nextProgram={nextProgram}
            progress={getProgramProgress(currentProgram)}
            onClose={() => setShowChannelInfo(false)}
            timeout={5000}
          />
        )}
        <HelpText>
          Press A to add/remove from favorites • Press I for program info • Press INFO for channel info • Press P for channel history • Press S to search • Press G for groups • Press F for favorites • Press E for EPG • Press O to sort • Press L to filter • Press T for settings • Press H for help • Enter numbers for quick channel access
        </HelpText>
        {showHelp && (
          <TizenHelp
            onClose={() => setShowHelp(false)}
            timeout={10000}
          />
        )}
        {showSearch && (
          <TizenSearch
            channels={channels || []}
            onSelect={handleChannelSelect}
            onClose={() => setShowSearch(false)}
          />
        )}
        {showGroups && (
          <ChannelGroup
            channels={channels || []}
            categories={categories || []}
            onSelect={handleChannelSelect}
            onClose={() => setShowGroups(false)}
          />
        )}
        {showFavorites && (
          <ChannelFavorites
            onSelect={handleChannelSelect}
            onClose={() => setShowFavorites(false)}
          />
        )}
        {showEdit && selectedChannel && (
          <ChannelEdit
            channel={selectedChannel}
            onSave={(editedChannel) => {
              setSelectedChannel(editedChannel);
              addNotification({
                message: `Channel ${editedChannel.name} updated`,
                type: 'success',
                duration: 2000,
              });
              setShowEdit(false);
            }}
            onClose={() => setShowEdit(false)}
          />
        )}
        {showSort && channels && (
          <ChannelSort
            channels={channels}
            onSave={(sortedChannels) => {
              // TODO: Save sorted channels to database
              addNotification({
                message: 'Channel order updated',
                type: 'success',
                duration: 2000,
              });
              setShowSort(false);
            }}
            onClose={() => setShowSort(false)}
          />
        )}
        {showFilter && channels && categories && (
          <ChannelFilter
            channels={channels}
            categories={categories}
            onFilter={(filters) => {
              // TODO: Apply filters to channel list
              addNotification({
                message: 'Filters applied',
                type: 'success',
                duration: 2000,
              });
              setShowFilter(false);
            }}
            onClose={() => setShowFilter(false)}
          />
        )}
        {showSettings && selectedChannel && (
          <ChannelSettings
            channel={selectedChannel}
            onSave={(settings) => {
              // TODO: Save channel settings
              addNotification({
                message: 'Channel settings updated',
                type: 'success',
                duration: 2000,
              });
              setShowSettings(false);
            }}
            onClose={() => setShowSettings(false)}
          />
        )}
        {showHistory && (
          <ChannelHistory
            channels={channels || []}
            onSelect={handleChannelSelect}
            onClose={() => setShowHistory(false)}
            maxItems={10}
          />
        )}

        {reminderProgram && (
          <EPGReminderPopup
            program={reminderProgram}
            autoSwitch={true}
            onClose={() => setReminderProgram(null)}
            onSwitch={() => {
              // TODO: Switch to the channel when the program starts
              console.log('Switching to program:', reminderProgram);
              setReminderProgram(null);
            }}
          />
        )}
      </PlayerContainer>
    </Container>
  );
};

export default LiveTV;
