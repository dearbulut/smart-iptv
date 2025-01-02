import React from 'react';
import styled, { keyframes } from 'styled-components';

interface TizenSplashScreenProps {
  message?: string;
  progress?: number;
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
  background: ${({ theme }) => theme.colors.background.main};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-in-out;
  z-index: 3000;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Message = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const ProgressContainer = styled.div`
  width: 300px;
  height: 4px;
  background: ${({ theme }) => theme.colors.background.hover};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.secondary.main};
  transition: width 0.3s ease;
`;

const TizenSplashScreen: React.FC<TizenSplashScreenProps> = ({
  message = 'Loading...',
  progress = 0,
}) => {
  return (
    <Container>
      <Logo src="/logo.png" alt="App Logo" />
      <Message>{message}</Message>
      <ProgressContainer>
        <Progress percent={progress} />
      </ProgressContainer>
    </Container>
  );
};

export default TizenSplashScreen;
