import { Button, HStack } from '@chakra-ui/react';

export type SubjectType = 'ALL' | 'KOREAN' | 'ENGLISH' | 'MATH';

interface Props {
    selectedSubject: SubjectType;
    onChange: (subject: SubjectType) => void;
}

const SUBJECTS: { label: string; value: SubjectType }[] = [
    { label: '국어', value: 'KOREAN' },
    { label: '영어', value: 'ENGLISH' },
    { label: '수학', value: 'MATH' },
];

export const SubjectFilter = ({ selectedSubject, onChange }: Props) => {
    return (
        <HStack spacing={2}>
            {SUBJECTS.map((subject) => {
                const isSelected = selectedSubject === subject.value;
                return (
                    <Button
                        key={subject.value}
                        onClick={() => onChange(subject.value)}
                        bg={isSelected ? '#53A8FE' : 'white'}
                        color={isSelected ? 'white' : '#A0A5B1'}
                        border="1px solid"
                        borderColor={isSelected ? '#53A8FE' : '#E2E4E8'}
                        borderRadius="18px"
                        fontSize="16px"
                        fontWeight="600"
                        px={6}
                        h="36px"
                        _hover={{
                            bg: isSelected ? '#4297ED' : '#F9F9FB',
                        }}
                    >
                        {subject.label}
                    </Button>
                );
            })}
        </HStack>
    );
};
