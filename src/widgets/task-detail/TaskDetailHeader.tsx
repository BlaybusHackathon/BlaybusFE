// src/widgets/task-detail/TaskDetailHeader.tsx
import { Badge, Box, HStack, Stack, Text, Flex, useBreakpointValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { SUBJECT_LABELS, SUBJECT_COLORS } from '@/shared/constants/subjects';
import { PinIcon } from '@/shared/ui/icons';

export type Subject = 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';

interface TaskDetailHeaderProps {
    subject: Subject; 
    date: string;
    isMentorChecked: boolean;
    title: string;
    isMandatory?: boolean | null;
    supplement?: string;
    action?: ReactNode;
    statusLabel?: string;
    statusText?: string;
}

export const TaskDetailHeader = ({
    subject,
    date,
    isMentorChecked,
    title,
    isMandatory,
    supplement,
    action,
    statusLabel,
    statusText,
}: TaskDetailHeaderProps) => {
    const resolvedStatusLabel = statusLabel ?? '멘토 확인';
    const pinSize = useBreakpointValue({ base: '18px', md: '24px' }) ?? '18px';
    const statusContent = statusText
        ? <Text color="#333333" fontWeight="bold">{statusText}</Text>
        : isMentorChecked
            ? (
                <Box color="gray.300">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#D1D5DB" />
                        <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Box>
            )
            : <Text color="gray.400">미확인</Text>;
    return (
        <Box mb={{base:0, md:12}}>
            <Box mb={6}>
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
                <Flex justify="space-between" align="center" gap={4} mt={{base: 4, md: 0}}>
                    <Flex align={'end'} gap={2} flex={1} minW={0}>
                        <HStack spacing={2} align="center" flex={1} minW={0}>
                            {Boolean(isMandatory) && (
                                <Box color="#373E56" flexShrink={0} display="flex" alignItems="center">
                                    <PinIcon width={pinSize} height={pinSize} />
                                </Box>
                            )}
                            <Text
                                fontSize={{base:"md", md:"4xl"}}
                                fontWeight="bold"
                                color="#1A1A1A"
                                lineHeight="1.2"
                            >
                                {title}
                            </Text>
                        </HStack>
                        <Text display={{base:"flex", md:"none"}} color="#989898" fontWeight="medium" fontSize={'xs'}>{date}</Text>
                    </Flex>
                    
                    {action && (
                        <Box flexShrink={0} display="flex" alignItems="center">
                            {action}
                        </Box>
                    )}
                </Flex>
            </Box>

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
                    <Text color="#8e8e8e" fontWeight="medium" minW="60px" >{resolvedStatusLabel}</Text>
                    {statusContent}
                </HStack>
            </Stack>
        </Box>
    );
};


