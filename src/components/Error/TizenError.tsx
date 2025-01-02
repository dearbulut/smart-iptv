import React from 'react';
import styled from 'styled-components';

interface TizenErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

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
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.secondary.main};
`;

const Message = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, primary }) =>
    primary ? theme.colors.secondary.main : theme.colors.background.card};
  color: ${({ theme, primary }) =>
    primary ? theme.colors.background.main : theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.secondary.main};
  }

  &.focused {
    background: ${({ theme, primary }) =>
      primary ? theme.colors.secondary.light : theme.colors.background.hover};
  }
`;

const HelpText = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TizenError: React.FC<TizenErrorProps> = ({
  title = 'Error',
  message,
  onRetry,
  onBack,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Message>{message}</Message>
      <ButtonContainer>
        {onRetry && (
          <Button primary className="focusable" onClick={onRetry}>
            Retry
          </Button>
        )}
        {onBack && (
          <Button className="focusable" onClick={onBack}>
            Back
          </Button>
        )}
      </ButtonContainer>
      <HelpText>
        Press RETURN to go back or ENTER to retry
      </HelpText>
    </Container>
  );
};

export default TizenError;
