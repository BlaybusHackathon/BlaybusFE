import { HStack, Button } from '@chakra-ui/react';
import { Subject, SUBJECT_LABELS } from '@/shared/constants/subjects';
import { SUBJECT_COLORS } from '@/shared/constants/studyTime';

interface Props {
  selectedSubject: Subject;
  onChange: (s: Subject) => void;
}

export const SubjectSelector = ({ selectedSubject, onChange }: Props) => {
  return (
    <HStack spacing={2} mb={4} overflowX="auto" pb={2}>
      {(Object.keys(SUBJECT_LABELS) as Subject[]).map((subj) => {
        const isSelected = selectedSubject === subj;
        const colors = SUBJECT_COLORS[subj];
        
        return (
          <Button
            key={subj}
            size="sm"
            onClick={() => onChange(subj)}
            bg={isSelected ? colors.bg : 'white'}
            color={isSelected ? colors.text : 'gray.500'}
            borderColor={isSelected ? colors.border : 'gray.200'}
            borderWidth="1px"
            _hover={{ bg: colors.bg, opacity: 0.8 }}
            flexShrink={0}
          >
            {SUBJECT_LABELS[subj]}
          </Button>
        );
      })}
    </HStack>
  );
};