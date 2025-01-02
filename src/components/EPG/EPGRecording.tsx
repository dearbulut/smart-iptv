import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGRecordingProps {
  program: IEPGProgram;
  onClose?: () => void;
  onConfirm?: (settings: RecordingSettings) => void;
}

interface RecordingSettings {
  startOffset: number;
  endOffset: number;
  quality: 'auto' | 'high' | 'medium' | 'low';
  series: boolean;
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

const Checkbox = styled.div<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid ${({ theme }) => theme.colors.text.secondary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ theme, checked }) =>
      checked ? theme.colors.secondary.main : 'transparent'};
    transition: ${({ theme }) => theme.transitions.default};
  }

  &.focused {
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
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

const EPGRecording: React.FC<EPGRecordingProps> = ({
  program,
  onClose,
  onConfirm,
}) => {
  const [settings, setSettings] = useState<RecordingSettings>({
    startOffset: 0,
    endOffset: 0,
    quality: 'auto',
    series: false,
  });

  const [focusedField, setFocusedField] = useState<string>('startOffset');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          switch (focusedField) {
            case 'endOffset':
              setFocusedField('startOffset');
              break;
            case 'quality':
              setFocusedField('endOffset');
              break;
            case 'series':
              setFocusedField('quality');
              break;
            case 'cancel':
            case 'confirm':
              setFocusedField('series');
              break;
          }
          break;
        case 'ArrowDown':
          switch (focusedField) {
            case 'startOffset':
              setFocusedField('endOffset');
              break;
            case 'endOffset':
              setFocusedField('quality');
              break;
            case 'quality':
              setFocusedField('series');
              break;
            case 'series':
              setFocusedField('cancel');
              break;
          }
          break;
        case 'ArrowLeft':
          if (focusedField === 'confirm') {
            setFocusedField('cancel');
          }
          break;
        case 'ArrowRight':
          if (focusedField === 'cancel') {
            setFocusedField('confirm');
          }
          break;
        case 'Enter':
          if (focusedField === 'series') {
            setSettings((prev) => ({ ...prev, series: !prev.series }));
          } else if (focusedField === 'confirm') {
            onConfirm?.(settings);
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
  }, [focusedField, settings, onConfirm, onClose]);

  return (
    <Container>
      <Title>Record: {program.title}</Title>
      <Form>
        <FormGroup>
          <Label>Start Recording</Label>
          <Select
            value={settings.startOffset}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                startOffset: parseInt(e.target.value),
              }))
            }
            className={focusedField === 'startOffset' ? 'focused' : ''}
            onFocus={() => setFocusedField('startOffset')}
          >
            <Option value={-300}>5 minutes before</Option>
            <Option value={-180}>3 minutes before</Option>
            <Option value={-60}>1 minute before</Option>
            <Option value={0}>On time</Option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>End Recording</Label>
          <Select
            value={settings.endOffset}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                endOffset: parseInt(e.target.value),
              }))
            }
            className={focusedField === 'endOffset' ? 'focused' : ''}
            onFocus={() => setFocusedField('endOffset')}
          >
            <Option value={0}>On time</Option>
            <Option value={60}>1 minute after</Option>
            <Option value={180}>3 minutes after</Option>
            <Option value={300}>5 minutes after</Option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Quality</Label>
          <Select
            value={settings.quality}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                quality: e.target.value as RecordingSettings['quality'],
              }))
            }
            className={focusedField === 'quality' ? 'focused' : ''}
            onFocus={() => setFocusedField('quality')}
          >
            <Option value="auto">Auto</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </FormGroup>

        <Checkbox
          checked={settings.series}
          className={focusedField === 'series' ? 'focused' : ''}
          onClick={() =>
            setSettings((prev) => ({ ...prev, series: !prev.series }))
          }
          onFocus={() => setFocusedField('series')}
        >
          Record all episodes in series
        </Checkbox>

        <ButtonContainer>
          <Button
            className={focusedField === 'cancel' ? 'focused' : ''}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            primary
            className={focusedField === 'confirm' ? 'focused' : ''}
            onClick={() => {
              onConfirm?.(settings);
              onClose?.();
            }}
          >
            Start Recording
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default EPGRecording;
