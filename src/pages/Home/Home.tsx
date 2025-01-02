import React from 'react';
import styled from 'styled-components';
import { useTVNavigation } from '@/hooks/useTVNavigation';

interface HomeProps {
  onNavigate: (section: string) => void;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 900px;
  width: 100%;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Icon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const HelpText = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { registerElement } = useTVNavigation({
    grid: true,
    gridColumns: 3,
    onSelect: (element) => {
      const section = element.getAttribute('data-section');
      if (section) {
        onNavigate(section);
      }
    },
  });

  return (
    <Container>
      <Title>Smart IPTV</Title>
      <Grid>
        <Card
          className="focusable"
          ref={(el) => registerElement(el, 0)}
          data-section="live"
        >
          <Icon>📺</Icon>
          <CardTitle>Live TV</CardTitle>
          <Description>Watch live TV channels</Description>
        </Card>
        <Card
          className="focusable"
          ref={(el) => registerElement(el, 1)}
          data-section="favorites"
        >
          <Icon>⭐</Icon>
          <CardTitle>Favorites</CardTitle>
          <Description>Access your favorite channels</Description>
        </Card>
        <Card
          className="focusable"
          ref={(el) => registerElement(el, 2)}
          data-section="settings"
        >
          <Icon>⚙️</Icon>
          <CardTitle>Settings</CardTitle>
          <Description>Configure app settings</Description>
        </Card>
      </Grid>
      <HelpText>
        Use arrow keys to navigate • Press ENTER to select • Press RETURN to go back
      </HelpText>
    </Container>
  );
};

export default Home;
