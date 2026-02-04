import { Badge, Box, HStack, Text } from '@chakra-ui/react';


interface TaskDetailHeaderProps {
    subject: string;
    date: string; // YYYY.MM.DD
    isMentorChecked: boolean;
    title: string;
}

const subjectColorMap: Record<string, string> = {
    국어: 'red',
    영어: 'purple',
    수학: 'blue',
    과학: 'green',
    사회: 'orange',
    // Add more as needed
};

export const TaskDetailHeader = ({
    subject,
    date,
    isMentorChecked,
    title,
}: TaskDetailHeaderProps) => {
    const badgeColor = subjectColorMap[subject] || 'gray';

    return (
        <Box mb={6}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                {title}
            </Text>

            <HStack spacing={8} color="gray.600" fontSize="sm">
                <HStack>
                    <Text width="60px">과목</Text>
                    <Badge colorScheme={badgeColor} borderRadius="full" px={3}>
                        {subject}
                    </Badge>
                </HStack>

                <HStack>
                    <Text width="60px">날짜</Text>
                    <Text fontWeight="medium">{date}</Text>
                </HStack>

                <HStack>
                    <Text width="60px">멘토 확인</Text>
                    {isMentorChecked ? (
                        <Badge colorScheme="green" variant="solid" borderRadius="full">
                            확인 완료
                        </Badge>
                    ) : (
                        <Badge colorScheme="gray" variant="solid" borderRadius="full">
                            미확인
                        </Badge>
                    )}
                </HStack>
            </HStack>
        </Box>
    );
};
