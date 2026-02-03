import { useState } from 'react';
import { VStack, HStack, Button } from '@chakra-ui/react';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Subject, SUBJECT_LABELS } from '@/shared/constants/subjects';

interface TaskAddFormProps {
  onSubmit: (data: { title: string; subject: Subject }) => void;
  onCancel: () => void;
}

export const TaskAddForm = ({ onSubmit, onCancel }: TaskAddFormProps) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('OTHER');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), subject });
    setTitle('');
  };

  return (
    <VStack spacing={3} p={4} bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.100">
      <Input
        placeholder="할 일을 입력하세요 (예: 영어 단어 50개)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <Select
        value={subject}
        onChange={(e) => setSubject(e.target.value as Subject)}
      >
        {Object.entries(SUBJECT_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </Select>
      <HStack w="full" justify="flex-end">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          취소
        </Button>
        <Button size="sm" colorScheme="blue" onClick={handleSubmit}>
          추가
        </Button>
      </HStack>
    </VStack>
  );
};