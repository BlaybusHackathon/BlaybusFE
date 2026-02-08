import { Box, IconButton } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationBellIcon } from '@/shared/ui/icons';
import { notificationApi } from '@/features/notification/api/notificationApi';
import { useNotificationStore } from '@/shared/stores/notificationStore';

interface Props {
  isVisible: boolean;
}

export const NotificationBell = ({ isVisible }: Props) => {
  const navigate = useNavigate();
  const { unreadCount, setUnreadCount } = useNotificationStore();

  const fetchCount = useCallback(async () => {
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    if (!isVisible) return;
    fetchCount();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchCount();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isVisible, fetchCount]);

  if (!isVisible) return null;

  return (
    <Box position="relative" pointerEvents="auto">
      <IconButton
        aria-label="Notifications"
        icon={<NotificationBellIcon />}
        variant="ghost"
        onClick={() => navigate('/mentee/notifications')}
        size="lg"
        color="#373E56"
        _hover={{ bg: 'gray.50' }}
      />
      {unreadCount > 0 && (
        <Box
          position="absolute"
          top="2px"
          right="2px"
          bg="#FD4646"
          color="white"
          fontSize="10px"
          fontWeight="bold"
          borderRadius="full"
          minW="18px"
          h="18px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px="4px"
        >
          {unreadCount}
        </Box>
      )}
    </Box>
  );
};
