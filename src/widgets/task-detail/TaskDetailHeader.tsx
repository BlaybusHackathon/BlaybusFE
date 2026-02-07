// src/widgets/task-detail/TaskDetailHeader.tsx
import { Badge, Box, HStack, Stack, Text, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import {SUBJECT_LABELS, SUBJECT_COLORS } from '@/shared/constants/subjects';

// 과목 타입 정의
export type Subject = 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';

interface TaskDetailHeaderProps {
    subject: Subject; 
    date: string;
    isMentorChecked: boolean;
    title: string;
    supplement?: string;
    action?: ReactNode; 
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
        <Box mb={{base:0, md:12}}>
            <Flex direction={{base:"column", md:"row"}} gap={{base: 4 ,md:0}} justify={{base:"flex-start",md:"space-between"}} align="start" mb={6}>
                <HStack spacing={8} display={{base:"flex", md:"none"}}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="30px" display={{base:"none", md:"flex"}}>과목</Text>
                    <Badge
                        bg={SUBJECT_COLORS[subject] || SUBJECT_COLORS.OTHER}
                        color="white"
                        borderRadius="full"
                        px={4}
                        py={1}
                        fontSize="13px"
                        fontWeight="bold"
                        textTransform="none"
                        letterSpacing="normal"
                    >
                        {SUBJECT_LABELS[subject] || SUBJECT_LABELS.OTHER}
                    </Badge>
                </HStack>
                <Flex align={'end'} gap={2}>
                    <Text fontSize={{base:"md", md:"4xl"}} fontWeight="bold" color="#1A1A1A" lineHeight="1.2">
                        {title}
                    </Text>
                    <Text color="#989898" fontWeight="medium" fontSize={'xs'}>{date}</Text>
                </Flex>
                
                {action && (
                    <Box ml={4}>
                        {action}
                    </Box>
                )}
            </Flex>

            {supplement && (
                <HStack spacing={6} mb={8} fontSize="16px" display={{base:"none", md:"flex"}}>
                    <Text color="#666666" fontWeight="medium">보완점</Text>
                    <Text color="#1A1A1A" fontWeight="medium">{supplement}</Text>
                </HStack>
            )}

            <Stack 
                direction={{ base: 'column', md: 'row' }} 
                spacing={{ base: 3, md: 10 }} 
                fontSize={{base:'xs', md:"xl"}} 
                align={{ base: 'flex-start', md: 'center' }}
                display={{base:"none", md:"flex"}}
            >
                <HStack spacing={8}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="30px" >과목</Text>
                    <Badge
                        bg={SUBJECT_COLORS[subject] || SUBJECT_COLORS.OTHER}
                        color="white"
                        borderRadius="full"
                        px={4}
                        py={1}
                        fontSize="13px"
                        fontWeight="bold"
                        textTransform="none"
                        letterSpacing="normal"
                    >
                        {SUBJECT_LABELS[subject] || SUBJECT_LABELS.OTHER}
                    </Badge>
                </HStack>

                <HStack spacing={8}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="30px" >날짜</Text>
                    <Text color="#333333" fontWeight="bold">{date}</Text>
                </HStack>

                <HStack spacing={4}>
                    <Text color="#8e8e8e" fontWeight="medium" minW="60px" >멘토 확인</Text>
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