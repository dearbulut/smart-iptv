import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGReminderProps {
  program: IEPGProgram;
  onClose?: () => void;
  onConfirm?: (settings: ReminderSettings) => void;
}

interface ReminderSettings {
  notifyBefore: number;
  notifyType: 'popup' | 'notification' | 'both';
  autoSwitch: boolean;
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

const EPGReminder: React.FC<EPGReminderProps> = ({
  program,
  onClose,
  onConfirm,
}) => {
  const [settings, setSettings] = useState<ReminderSettings>({
    notifyBefore: 300,
    notifyType: 'both',
    autoSwitch: true,
  });

  const [focusedField, setFocusedField] = useState<string>('notifyBefore');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          switch (focusedField) {
            case 'notifyType':
              setFocusedField('notifyBefore');
              break;
            case 'autoSwitch':
              setFocusedField('notifyType');
              break;
            case 'cancel':
            case 'confirm':
              setFocusedField('autoSwitch');
              break;
          }
          break;
        case 'ArrowDown':
          switch (focusedField) {
            case 'notifyBefore':
              setFocusedField('notifyType');
              break;
            case 'notifyType':
              setFocusedField('autoSwitch');
              break;
            case 'autoSwitch':
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
          if (focusedField === 'autoSwitch') {
            setSettings((prev) => ({ ...prev, autoSwitch: !prev.autoSwitch }));
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
      <Title>Set Reminder: {program.title}</Title>
      <Form>
        <FormGroup>
          <Label>Notify Before</Label>
          <Select
            value={settings.notifyBefore}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                notifyBefore: parseInt(e.target.value),
              }))
            }
            className={focusedField === 'notifyBefore' ? 'focused' : ''}
            onFocus={() => setFocusedField('notifyBefore')}
          >
            <Option value={300}>5 minutes before</Option>
            <Option value={600}>10 minutes before</Option>
            <Option value={900}>15 minutes before</Option>
            <Option value={1800}>30 minutes before</Option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Notification Type</Label>
          <Select
            value={settings.notifyType}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                notifyType: e.target.value as ReminderSettings['notifyType'],
              }))
            }
            className={focusedField === 'notifyType' ? 'focused' : ''}
            onFocus={() => setFocusedField('notifyType')}
          >
            <Option value="popup">Popup</Option>
            <Option value="notification">Notification</Option>
            <Option value="both">Both</Option>
          </Select>
        </FormGroup>

        <Checkbox
          checked={settings.autoSwitch}
          className={focusedField === 'autoSwitch' ? 'focused' : ''}
          onClick={() =>
            setSettings((prev) => ({ ...prev, autoSwitch: !prev.autoSwitch }))
          }
          onFocus={() => setFocusedField('autoSwitch')}
        >
          Automatically switch to channel
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
            Set Reminder
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default EPGReminder;
