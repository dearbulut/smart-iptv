import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useSeriesService } from '@/contexts/ServiceContext';
import { ISeries } from '@/types';
import SeriesGrid from '@/components/Series/SeriesGrid';
import SeriesDetails from '@/components/Series/SeriesDetails';
import SeriesSearch from '@/components/Series/SeriesSearch';
import SeriesCategories from '@/components/Series/SeriesCategories';
import SeriesFilter from '@/components/Series/SeriesFilter';
import { useTizenTV } from '@/hooks/useTizenTV';
import { useNotificationStore } from '@/store/notification';

interface SeriesProps {
  onBack: () => void;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.colors.background.main};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HelpText = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1000;
`;

const Series: React.FC<SeriesProps> = ({ onBack }) => {
  const seriesService = useSeriesService();
  const { addNotification } = useNotificationStore();
  const [selectedSeries, setSelectedSeries] = useState<ISeries | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const { data: series, isLoading } = useQuery({
    queryKey: ['series'],
    queryFn: () => seriesService.getSeries(),
  });

  const { data: categories } = useQuery({
    queryKey: ['series-categories'],
    queryFn: () => seriesService.getCategories(),
  });

  useTizenTV({
    onKeyDown: (event) => {
      switch (event.keyCode) {
        case 10009: // RETURN key
          if (selectedSeries) {
            setSelectedSeries(null);
          } else if (showSearch) {
            setShowSearch(false);
          } else if (showCategories) {
            setShowCategories(false);
          } else if (showFilter) {
            setShowFilter(false);
          } else {
            onBack();
          }
          break;
        case 83: // S key
          if (!selectedSeries) {
            setShowSearch(true);
          }
          break;
        case 67: // C key
          if (!selectedSeries) {
            setShowCategories(true);
          }
          break;
        case 70: // F key
          if (!selectedSeries) {
            setShowFilter(true);
          }
          break;
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Content>
        <Header>
          <Title>TV Series</Title>
        </Header>

        <SeriesGrid
          series={series || []}
          onSelect={(series) => {
            setSelectedSeries(series);
            addNotification({
              message: `Selected: ${series.title}`,
              type: 'info',
              duration: 2000,
            });
          }}
        />

        <HelpText>
          Press S to search • Press C for categories • Press F to filter • Press
          RETURN to go back
        </HelpText>

        {selectedSeries && (
          <SeriesDetails
            series={selectedSeries}
            onClose={() => setSelectedSeries(null)}
            onPlay={(episode) => {
              // TODO: Implement episode playback
              addNotification({
                message: `Playing: ${selectedSeries.title} S${episode.season}E${episode.episode}`,
                type: 'success',
                duration: 2000,
              });
            }}
            onAddToFavorites={() => {
              // TODO: Implement favorites
              addNotification({
                message: `Added to favorites: ${selectedSeries.title}`,
                type: 'success',
                duration: 2000,
              });
            }}
          />
        )}

        {showSearch && (
          <SeriesSearch
            series={series || []}
            onSelect={(series) => {
              setSelectedSeries(series);
              setShowSearch(false);
            }}
            onClose={() => setShowSearch(false)}
          />
        )}

        {showCategories && categories && (
          <SeriesCategories
            categories={categories}
            series={series || []}
            onSelect={(series) => {
              setSelectedSeries(series);
              setShowCategories(false);
            }}
            onClose={() => setShowCategories(false)}
          />
        )}

        {showFilter && (
          <SeriesFilter
            series={series || []}
            onApply={(filters) => {
              // TODO: Implement filtering
              console.log('Applied filters:', filters);
              setShowFilter(false);
            }}
            onClose={() => setShowFilter(false)}
          />
        )}
      </Content>
    </Container>
  );
};

export default Series;
