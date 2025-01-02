import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
`;

const Sidebar = styled.div`
  width: 300px;
  background: rgba(20, 20, 20, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const Logo = styled.div`
  padding: 0 20px 20px;
  font-size: 24px;
  font-weight: bold;
  color: #ffde33;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const Navigation = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const NavItem = styled.div<{ active?: boolean }>`
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  background: ${({ active }) => active ? 'rgba(255, 222, 51, 0.1)' : 'transparent'};
  border-left: 4px solid ${({ active }) => active ? '#ffde33' : 'transparent'};

  &:hover, &.focused {
    background: rgba(255, 222, 51, 0.1);
  }

  &.focused {
    border-left-color: #ffde33;
  }
`;

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
`;

const NavText = styled.div`
  font-size: 16px;
  flex: 1;
`;

const StatusBar = styled.div`
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusDot = styled.div<{ online?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ online }) => online ? '#4CAF50' : '#f44336'};
`;

interface MainLayoutProps {
  children: React.ReactNode;
  activeSection?: 'live' | 'movies' | 'series' | 'favorites';
  onSectionChange?: (section: string) => void;
  isOnline?: boolean;
  username?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeSection = 'live',
  onSectionChange,
  isOnline = true,
  username = 'Guest',
}) => {
  return (
    <Container>
      <Sidebar>
        <Logo>Smart IPTV</Logo>
        <Navigation>
          <NavItem 
            active={activeSection === 'live'}
            onClick={() => onSectionChange?.('live')}
            tabIndex={0}
          >
            <NavIcon>📺</NavIcon>
            <NavText>Live TV</NavText>
          </NavItem>
          <NavItem 
            active={activeSection === 'movies'}
            onClick={() => onSectionChange?.('movies')}
            tabIndex={0}
          >
            <NavIcon>🎬</NavIcon>
            <NavText>Movies</NavText>
          </NavItem>
          <NavItem 
            active={activeSection === 'series'}
            onClick={() => onSectionChange?.('series')}
            tabIndex={0}
          >
            <NavIcon>🎭</NavIcon>
            <NavText>Series</NavText>
          </NavItem>
          <NavItem 
            active={activeSection === 'favorites'}
            onClick={() => onSectionChange?.('favorites')}
            tabIndex={0}
          >
            <NavIcon>⭐</NavIcon>
            <NavText>Favorites</NavText>
          </NavItem>
        </Navigation>
        <StatusBar>
          <StatusDot online={isOnline} />
          {username} • {isOnline ? 'Online' : 'Offline'}
        </StatusBar>
      </Sidebar>
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default MainLayout;
