import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface TizenHelpProps {
  onClose?: () => void;
  timeout?: number;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.3s ease-in-out;
  z-index: 2000;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  color: ${({ theme }) => theme.colors.secondary.main};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  width: 100%;
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Key = styled.div`
  background: ${({ theme }) => theme.colors.background.main};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: bold;
  min-width: 80px;
  text-align: center;
`;

const Description = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TizenHelp: React.FC<TizenHelpProps> = ({
  onClose,
  timeout = 10000,
}) => {
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout, onClose]);

  return (
    <Container>
      <Title>Keyboard Shortcuts</Title>
      <Grid>
        <Section>
          <SectionTitle>Navigation</SectionTitle>
          <List>
            <ListItem>
              <Key>↑↓←→</Key>
              <Description>Navigate through items</Description>
            </ListItem>
            <ListItem>
              <Key>ENTER</Key>
              <Description>Select item</Description>
            </ListItem>
            <ListItem>
              <Key>RETURN</Key>
              <Description>Go back / Close overlay</Description>
            </ListItem>
            <ListItem>
              <Key>0-9</Key>
              <Description>Quick channel access</Description>
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Playback</SectionTitle>
          <List>
            <ListItem>
              <Key>PLAY</Key>
              <Description>Play video</Description>
            </ListItem>
            <ListItem>
              <Key>PAUSE</Key>
              <Description>Pause video</Description>
            </ListItem>
            <ListItem>
              <Key>STOP</Key>
              <Description>Stop video</Description>
            </ListItem>
            <ListItem>
              <Key>FF</Key>
              <Description>Fast forward</Description>
            </ListItem>
            <ListItem>
              <Key>RW</Key>
              <Description>Rewind</Description>
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Features</SectionTitle>
          <List>
            <ListItem>
              <Key>A</Key>
              <Description>Add/Remove from favorites</Description>
            </ListItem>
            <ListItem>
              <Key>I</Key>
              <Description>Show program info</Description>
            </ListItem>
            <ListItem>
              <Key>INFO</Key>
              <Description>Show channel info</Description>
            </ListItem>
            <ListItem>
              <Key>P</Key>
              <Description>Show channel history</Description>
            </ListItem>
          </List>
        </Section>
      </Grid>
      <Footer>Press RETURN to close this help screen</Footer>
    </Container>
  );
};

export default TizenHelp;
