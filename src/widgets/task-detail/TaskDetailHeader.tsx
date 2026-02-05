// src/widgets/task-detail/TaskDetailHeader.tsx
import { Badge, Box, HStack, Stack, Text, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TaskDetailHeaderProps {
    subject: string;
    date: string;
    isMentorChecked: boolean;
    title: string;
    supplement?: string; // 보완점 내용
    action?: ReactNode;  // [New] 우측 상단에 배치할 버튼 등을 위한 Slot
}

export const TaskDetailHeader = ({
    subject,
    date,
    isMentorChecked,
    title,
    supplement,
    action,
}: TaskDetailHeaderProps) => {
    return (
        <Box mb={12}>
            {/* 타이틀과 액션 버튼(다운로드 등)을 가로로 배치 */}
            <Flex justify="space-between" align="start" mb={6}>
                <Text fontSize="28px" fontWeight="bold" color="#1A1A1A" lineHeight="1.2">
                    {title}
                </Text>
                {action && (
                    <Box ml={4}>
                        {action}
                    </Box>
                )}
            </Flex>

            {supplement && (
                <HStack spacing={6} mb={8} fontSize="16px">
                    <Text color="#666666" fontWeight="medium">보완점</Text>
                    <Text color="#1A1A1A" fontWeight="medium">{supplement}</Text>
                </HStack>
            )}

            <Stack 
                direction={{ base: 'column', md: 'row' }} 
                spacing={{ base: 3, md: 10 }} 
                fontSize="15px" 
                align={{ base: 'flex-start', md: 'center' }}
            >
                <HStack spacing={8}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="30px">과목</Text>
                    <Badge
                        bg="#4ADE80"
                        color="white"
                        borderRadius="full"
                        px={4}
                        py={1}
                        fontSize="13px"
                        fontWeight="bold"
                        textTransform="none"
                        letterSpacing="normal"
                    >
                        {subject}
                    </Badge>
                </HStack>

                <HStack spacing={8}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="30px">날짜</Text>
                    <Text color="#333333" fontWeight="bold">{date}</Text>
                </HStack>

                <HStack spacing={4}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="60px">멘토 확인</Text>
                    {isMentorChecked ? (
                        <Box color="gray.300">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#D1D5DB" />
                                <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Box>
                    ) : (
                        <Text color="gray.400">미확인</Text>
                    )}
                </HStack>
            </Stack>
        </Box>
    );
};