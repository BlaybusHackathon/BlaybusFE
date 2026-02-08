import { Box, Container, Flex, HStack, Text, VStack, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { notificationApi, NotificationFilter } from '@/features/notification/api/notificationApi';
import { Notification } from '@/entities/notification/types';
import {
  NotificationCommentIcon,
  NotificationFeedbackIcon,
  NotificationTaskIcon,
} from '@/shared/ui/icons';
import { useNotificationStore } from '@/shared/stores/notificationStore';

const getKstDate = (value: string): Date => {
  if (!value) return new Date(NaN);
  if (value.includes('Z') || value.includes('+')) return new Date(value);
  return new Date(`${value}+09:00`);
};

const getKstTodayKey = (): string => {
  const now = new Date();
  const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  return format(kst, 'yyyy-MM-dd');
};

const getDateKey = (value: string): string => {
  const date = getKstDate(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'yyyy-MM-dd');
};

const formatDateLabel = (value: string): string => {
  const date = getKstDate(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'M월 d일');
};

const getTypeLabel = (type: Notification['type']): string => {
  if (type === 'COMMENT') return '댓글';
  if (type === 'TASK' || type === 'SUBMISSION' || type === 'REMINDER') return '할 일';
  return '피드백';
};

const getMessage = (item: Notification): string => {
  const title = item.targetTitle ?? '과제';
  switch (item.type) {
    case 'FEEDBACK':
    case 'PLAN_FEEDBACK':
    case 'WEEKLY_REPORT':
    case 'ZOOM_FEEDBACK':
      return `멘토님이 ${title}에 피드백을 남기셨어요.`;
    case 'COMMENT':
      return '멘토님이 질문에 답변을 남기셨어요.';
    case 'TASK':
    case 'SUBMISSION':
    case 'REMINDER':
      return '멘토님이 새로운 할 일을 추가했어요.';
    default:
      return item.message || '멘토님이 알림을 보냈어요.';
  }
};

const getIcon = (type: Notification['type']) => {
  if (type === 'COMMENT') return NotificationCommentIcon;
  if (type === 'TASK' || type === 'SUBMISSION' || type === 'REMINDER') return NotificationTaskIcon;
  return NotificationFeedbackIcon;
};

export default function MenteeNotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const { unreadCount, setUnreadCount } = useNotificationStore();

  const { data, isLoading, setData } = useApiQuery(
    () => notificationApi.list({ filter, page: 0, size: 20 }),
    [filter]
  );

  const items = data?.content ?? [];

  const todayKey = getKstTodayKey();
  const todayItems = items.filter((item) => getDateKey(item.createdAt) === todayKey);
  const pastItems = items.filter((item) => getDateKey(item.createdAt) !== todayKey);

  const markReadLocal = (id: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      };
    });
  };

  const handleClick = async (item: Notification) => {
    if (!item.isRead) {
      try {
        await notificationApi.markRead(item.id);
        markReadLocal(item.id);
        setUnreadCount(Math.max(unreadCount - 1, 0));
      } catch {
        // ignore
      }
    }

    const targetType = item.targetType;
    const targetId = item.targetId;
    if (!targetType) return;

    if (targetType === 'WEEKLY_REPORT' && targetId) {
      navigate(`/mentee/report/${targetId}`);
      return;
    }
    if (targetType === 'ZOOM_FEEDBACK' && targetId) {
      navigate(`/mentee/feedback/zoom/${targetId}`);
      return;
    }
    if (targetType === 'PLAN_FEEDBACK') {
      navigate('/mentee/planner');
      return;
    }
    if (targetType === 'TASK' && targetId) {
      navigate(`/mentee/task/${targetId}`);
      return;
    }
    if (targetType === 'COMMENT' && targetId) {
      navigate(`/mentee/task/${targetId}`);
      return;
    }
    if (targetType === 'FEEDBACK' && targetId) {
      navigate(`/mentee/task/${targetId}`);
      return;
    }
    if (targetType === 'REMINDER') {
      navigate('/mentee/planner');
      return;
    }
    if (targetType === 'SUBMISSION' && targetId) {
      navigate(`/mentee/task/${targetId}`);
    }
  };

  return (
    <Box bg="#F9F9FB" minH="100vh" pt={4}>
      <Container maxW="container.md" px={4}>
        <HStack spacing={2} mb={4}>
          {[
            { label: '전체', value: 'all' },
            { label: '읽음', value: 'read' },
            { label: '안읽음', value: 'unread' },
          ].map((item) => {
            const isActive = filter === item.value;
            return (
              <Button
                key={item.value}
                size="sm"
                borderRadius="full"
                bg={isActive ? '#53A8FE' : 'white'}
                color={isActive ? 'white' : '#6B7280'}
                border="1px solid"
                borderColor={isActive ? '#53A8FE' : '#E5E7EB'}
                _hover={{ bg: isActive ? '#3B82F6' : '#F9FAFB' }}
                onClick={() => setFilter(item.value as NotificationFilter)}
              >
                {item.label}
              </Button>
            );
          })}
        </HStack>

        {isLoading ? (
          <Box py={8} textAlign="center" color="gray.400">
            불러오는 중입니다.
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {todayItems.length > 0 && (
              <>
                <Text fontSize="sm" fontWeight="bold" color="#6B7280">
                  오늘
                </Text>
                <VStack spacing={3} align="stretch">
                  {todayItems.map((item) => {
                    const Icon = getIcon(item.type);
                    const isRead = item.isRead;
                    return (
                      <Flex
                        key={item.id}
                        bg="white"
                        borderRadius="16px"
                        p={4}
                        gap={3}
                        align="flex-start"
                        boxShadow="sm"
                        opacity={isRead ? 0.5 : 1}
                        cursor="pointer"
                        onClick={() => handleClick(item)}
                      >
                        <Box color="#373E56" mt={1}>
                          <Icon />
                        </Box>
                        <Box flex={1}>
                          <HStack spacing={2} mb={1}>
                            <Text fontSize="sm" fontWeight="bold" color="#373E56">
                              {getTypeLabel(item.type)}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {formatDateLabel(item.createdAt)}
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="#6B7280">
                            {getMessage(item)}
                          </Text>
                        </Box>
                      </Flex>
                    );
                  })}
                </VStack>
              </>
            )}

            {pastItems.length > 0 && (
              <>
                <Box h="1px" bg="#E5E7EB" my={2} />
                <Text fontSize="sm" fontWeight="bold" color="#6B7280">
                  이전
                </Text>
                <VStack spacing={3} align="stretch">
                  {pastItems.map((item) => {
                    const Icon = getIcon(item.type);
                    const isRead = item.isRead;
                    return (
                      <Flex
                        key={item.id}
                        bg="white"
                        borderRadius="16px"
                        p={4}
                        gap={3}
                        align="flex-start"
                        boxShadow="sm"
                        opacity={isRead ? 0.5 : 1}
                        cursor="pointer"
                        onClick={() => handleClick(item)}
                      >
                        <Box color="#373E56" mt={1}>
                          <Icon />
                        </Box>
                        <Box flex={1}>
                          <HStack spacing={2} mb={1}>
                            <Text fontSize="sm" fontWeight="bold" color="#373E56">
                              {getTypeLabel(item.type)}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {formatDateLabel(item.createdAt)}
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="#6B7280">
                            {getMessage(item)}
                          </Text>
                        </Box>
                      </Flex>
                    );
                  })}
                </VStack>
              </>
            )}

            {todayItems.length === 0 && pastItems.length === 0 && (
              <Box py={12} textAlign="center" color="gray.400">
                알림이 없습니다.
              </Box>
            )}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
