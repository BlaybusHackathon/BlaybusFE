import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useScheduleCreateStore } from '../model/store';
import { Subject } from '../model/types';

export const SubjectSection = () => {
    const { subject, isWeaknessSelected, setSubject, toggleWeakness } = useScheduleCreateStore();

    const subjects: { label: string; value: Subject; colorScheme: string }[] = [
        { label: '국어', value: 'KOREAN', colorScheme: 'blue' },
        { label: '영어', value: 'ENGLISH', colorScheme: 'purple' },
        { label: '수학', value: 'MATH', colorScheme: 'orange' },
    ];

    return (
        <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>과목</Text>
            <HStack spacing={3}>
                {subjects.map((sub) => (
                    <Button
                        key={sub.value}
                        onClick={() => setSubject(sub.value)}
                        variant="unstyled"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w="full"
                        h="45px"
                        borderRadius="md"
                        fontSize="md"
                        fontWeight="medium"
                        bg={subject === sub.value ? '#53A8FE' : 'white'}
                        color={subject === sub.value ? 'white' : 'gray.400'}
                        border="1px solid"
                        borderColor={subject === sub.value ? '#53A8FE' : 'gray.200'}
                        _hover={{ bg: subject === sub.value ? '#4293E3' : 'gray.50' }}
                    >
                        {sub.label}
                    </Button>
                ))}
            </HStack>
        </Box>
    );
};
