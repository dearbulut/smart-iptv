import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel } from '@/types';

interface ChannelSettingsProps {
  channel: IChannel;
  onSave: (settings: ChannelSettings) => void;
  onClose?: () => void;
}

interface ChannelSettings {
  audioTrack?: string;
  subtitles?: string;
  quality?: string;
  aspectRatio?: string;
}

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${slideIn} 0.3s ease-in-out;
  z-index: 1000;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }

  &.focused {
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Option = styled.option`
  background: ${({ theme }) => theme.colors.background.main};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  background: ${({ theme, primary }) =>
    primary ? theme.colors.secondary.main : 'transparent'};
  border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, primary }) =>
    primary ? theme.colors.background.main : theme.colors.secondary.main};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.secondary.main};
    color: ${({ theme }) => theme.colors.background.main};
  }
`;

const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  channel,
  onSave,
  onClose,
}) => {
  const [settings, setSettings] = useState<ChannelSettings>({});
  const [focusedField, setFocusedField] = useState<string>('audioTrack');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          switch (focusedField) {
            case 'subtitles':
              setFocusedField('audioTrack');
              break;
            case 'quality':
              setFocusedField('subtitles');
              break;
            case 'aspectRatio':
              setFocusedField('quality');
              break;
            case 'cancel':
            case 'apply':
              setFocusedField('aspectRatio');
              break;
          }
          break;
        case 'ArrowDown':
          switch (focusedField) {
            case 'audioTrack':
              setFocusedField('subtitles');
              break;
            case 'subtitles':
              setFocusedField('quality');
              break;
            case 'quality':
              setFocusedField('aspectRatio');
              break;
            case 'aspectRatio':
              setFocusedField('cancel');
              break;
          }
          break;
        case 'ArrowLeft':
          if (focusedField === 'apply') {
            setFocusedField('cancel');
          }
          break;
        case 'ArrowRight':
          if (focusedField === 'cancel') {
            setFocusedField('apply');
          }
          break;
        case 'Enter':
          if (focusedField === 'apply') {
            onSave(settings);
            onClose?.();
          } else if (focusedField === 'cancel') {
            onClose?.();
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedField, settings, onSave, onClose]);

  return (
    <Container>
      <Title>Channel Settings - {channel.name}</Title>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <Label>Audio Track</Label>
          <Select
            value={settings.audioTrack || ''}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, audioTrack: e.target.value }))
            }
            className={focusedField === 'audioTrack' ? 'focused' : ''}
            onFocus={() => setFocusedField('audioTrack')}
          >
            <Option value="">Default</Option>
            <Option value="eng">English</Option>
            <Option value="spa">Spanish</Option>
            <Option value="fra">French</Option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Subtitles</Label>
          <Select
            value={settings.subtitles || ''}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, subtitles: e.target.value }))
            }
            className={focusedField === 'subtitles' ? 'focused' : ''}
            onFocus={() => setFocusedField('subtitles')}
          >
            <Option value="">Off</Option>
            <Option value="eng">English</Option>
            <Option value="spa">Spanish</Option>
            <Option value="fra">French</Option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Quality</Label>
          <Select
            value={settings.quality || ''}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, quality: e.target.value }))
            }
            className={focusedField === 'quality' ? 'focused' : ''}
            onFocus={() => setFocusedField('quality')}
          >
            <Option value="auto">Auto</Option>
            <Option value="1080p">1080p</Option>
            <Option value="720p">720p</Option>
            <Option value="480p">480p</Option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Aspect Ratio</Label>
          <Select
            value={settings.aspectRatio || ''}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, aspectRatio: e.target.value }))
            }
            className={focusedField === 'aspectRatio' ? 'focused' : ''}
            onFocus={() => setFocusedField('aspectRatio')}
          >
            <Option value="auto">Auto</Option>
            <Option value="16:9">16:9</Option>
            <Option value="4:3">4:3</Option>
            <Option value="stretch">Stretch</Option>
          </Select>
        </FormGroup>

        <ButtonContainer>
          <Button
            className={focusedField === 'cancel' ? 'focused' : ''}
            onClick={() => onClose?.()}
          >
            Cancel
          </Button>
          <Button
            primary
            className={focusedField === 'apply' ? 'focused' : ''}
            onClick={() => {
              onSave(settings);
              onClose?.();
            }}
          >
            Apply
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default ChannelSettings;
