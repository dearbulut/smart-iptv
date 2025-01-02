import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNotificationStore } from '@/store/notification';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

const Container = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 2000;
`;

const NotificationItem = styled.div<{ type: string; exiting?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.success.main;
      case 'error':
        return theme.colors.error.main;
      case 'warning':
        return theme.colors.warning.main;
      default:
        return theme.colors.info.main;
    }
  }};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-width: 300px;
  box-shadow: ${({ theme }) => theme.shadows.notification};
  animation: ${({ exiting }) => (exiting ? slideOut : slideIn)} 0.3s ease-in-out;
`;

const Message = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Progress = styled.div<{ duration: number }>`
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    animation: progress ${({ duration }) => duration}ms linear forwards;
  }

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

const NotificationList: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, removeNotification]);

  return (
    <Container>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          type={notification.type}
          exiting={notification.exiting}
        >
          <Message>{notification.message}</Message>
          {notification.duration && (
            <Progress duration={notification.duration} />
          )}
        </NotificationItem>
      ))}
    </Container>
  );
};

export default NotificationList;
