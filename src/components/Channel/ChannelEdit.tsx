import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel } from '@/types';
import TizenKeyboard from '../Keyboard/TizenKeyboard';

interface ChannelEditProps {
  channel: IChannel;
  onSave: (channel: IChannel) => void;
  onClose?: () => void;
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

const Input = styled.input`
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

const ChannelEdit: React.FC<ChannelEditProps> = ({
  channel,
  onSave,
  onClose,
}) => {
  const [editedChannel, setEditedChannel] = useState({ ...channel });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showKeyboard) return;

      switch (event.key) {
        case 'ArrowUp':
          if (focusedField === 'name') {
            setFocusedField('cancel');
          } else if (focusedField === 'cancel' || focusedField === 'save') {
            setFocusedField('name');
          }
          break;
        case 'ArrowDown':
          if (focusedField === 'name') {
            setFocusedField('cancel');
          }
          break;
        case 'ArrowLeft':
          if (focusedField === 'save') {
            setFocusedField('cancel');
          }
          break;
        case 'ArrowRight':
          if (focusedField === 'cancel') {
            setFocusedField('save');
          }
          break;
        case 'Enter':
          if (focusedField === 'name') {
            setShowKeyboard(true);
          } else if (focusedField === 'save') {
            onSave(editedChannel);
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
  }, [focusedField, showKeyboard, editedChannel, onSave, onClose]);

  useEffect(() => {
    setFocusedField('name');
  }, []);

  return (
    <Container>
      <Title>Edit Channel</Title>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <Label>Channel Name</Label>
          <Input
            type="text"
            value={editedChannel.name}
            onChange={(e) =>
              setEditedChannel({ ...editedChannel, name: e.target.value })
            }
            className={focusedField === 'name' ? 'focused' : ''}
            onFocus={() => setFocusedField('name')}
          />
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
            className={focusedField === 'save' ? 'focused' : ''}
            onClick={() => {
              onSave(editedChannel);
              onClose?.();
            }}
          >
            Save
          </Button>
        </ButtonContainer>
      </Form>

      {showKeyboard && (
        <TizenKeyboard
          initialValue={editedChannel.name}
          placeholder="Channel name"
          onSubmit={(value) => {
            setEditedChannel({ ...editedChannel, name: value });
            setShowKeyboard(false);
          }}
          onCancel={() => setShowKeyboard(false)}
        />
      )}
    </Container>
  );
};

export default ChannelEdit;
