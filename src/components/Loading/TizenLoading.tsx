import React from 'react';
import styled, { keyframes } from 'styled-components';

interface TizenLoadingProps {
  text?: string;
  progress?: number;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.main};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Spinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid ${({ theme }) => theme.colors.background.card};
  border-top-color: ${({ theme }) => theme.colors.secondary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Text = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProgressContainer = styled.div`
  width: 200px;
  height: 4px;
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: 2px;
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.secondary.main};
  transition: width 0.3s ease;
`;

const TizenLoading: React.FC<TizenLoadingProps> = ({
  text = 'Loading...',
  progress,
}) => {
  return (
    <Container>
      <Spinner />
      <Text>{text}</Text>
      {typeof progress === 'number' && (
        <ProgressContainer>
          <Progress percent={progress} />
        </ProgressContainer>
      )}
    </Container>
  );
};

export default TizenLoading;
