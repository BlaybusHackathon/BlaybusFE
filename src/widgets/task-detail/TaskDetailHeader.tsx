import { Badge, Box, HStack, Stack, Text, Flex } from '@chakra-ui/react';

interface TaskDetailHeaderProps {
    subject: string;
    date: string;
    isMentorChecked: boolean;
    title: string;
    supplement?: string;
}

export const TaskDetailHeader = ({
    subject,
    date,
    isMentorChecked,
    title,
    supplement,
}: TaskDetailHeaderProps) => {
    return (
        <Box mb={12}>
            {/* 제목 */}
            <Text fontSize="28px" fontWeight="bold" mb={6} color="#1A1A1A">
                {title}
            </Text>

            {/* 보완점 (기존 스타일 유지) */}
            {supplement && (
                <HStack spacing={6} mb={8} fontSize="16px">
                    <Text color="#666666" fontWeight="medium">보완점</Text>
                    <Text color="#1A1A1A" fontWeight="medium">{supplement}</Text>
                </HStack>
            )}

            {/* [수정 포인트] 정보 영역 (과목, 날짜, 멘토 확인)
               - HStack 대신 Stack 사용
               - direction: 모바일은 column, 데스크톱은 row
               - spacing: 반응형으로 조절 (세로일 땐 좀 더 촘촘하게, 가로일 땐 넓게)
            */}
            <Stack 
                direction={{ base: 'column', md: 'row' }} 
                spacing={{ base: 3, md: 10 }} 
                fontSize="15px" 
                align={{ base: 'flex-start', md: 'center' }}
            >
                {/* 1. 과목 */}
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

                {/* 2. 날짜 */}
                <HStack spacing={8}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="30px">날짜</Text>
                    <Text color="#333333" fontWeight="bold">{date}</Text>
                </HStack>

                {/* 3. 멘토 확인 */}
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