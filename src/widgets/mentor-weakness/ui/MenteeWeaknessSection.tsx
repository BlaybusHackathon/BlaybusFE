import { useState, useMemo } from 'react';
import { Box, Flex, Text, Button, HStack, VStack } from '@chakra-ui/react';
import { Subject } from '@/shared/constants/subjects';
import { Weakness } from '@/entities/weakness/types';
import { MOCK_WEAKNESSES } from '@/features/weakness/model/mockWeaknessData';
import { WeaknessItem } from './WeaknessItem';
import { AddWeaknessButton } from './AddWeaknessButton';

const SUBJECT_TABS: { value: Subject; label: string }[] = [
  { value: 'KOREAN', label: '국어' },
  { value: 'ENGLISH', label: '영어' },
  { value: 'MATH', label: '수학' },
];

export const MenteeWeaknessSection = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('KOREAN');
  const [weaknesses, setWeaknesses] = useState(MOCK_WEAKNESSES);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredList = useMemo(() => {
    return weaknesses.filter((w) => w.subject === selectedSubject);
  }, [weaknesses, selectedSubject]);

  const handleAddClick = () => {
    setEditingId(null);
    setIsAdding(true);
  };

  const handleEditClick = (id: string) => {
    setIsAdding(false);
    setEditingId(id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = (id: string, title: string, fileName?: string) => {
    if (isAdding) {
      const newWeakness: Weakness = {
        id: `new-${Date.now()}`,
        title,
        fileName,
        subject: selectedSubject,
        menteeId: 'mentee-1',
        inforId: 'info-1',
        contentId: 'content-new',
      };
      setWeaknesses((prev) => [...prev, newWeakness]);
      setIsAdding(false);
    } else {
      setWeaknesses((prev) =>
        prev.map((w) => (w.id === id ? { ...w, title, fileName } : w))
      );
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setWeaknesses((prev) => prev.filter((w) => w.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const handleTabChange = (subject: Subject) => {
    setSelectedSubject(subject);
    handleCancel(); 
  };

  return (
    <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="3xl" boxShadow="sm">
      <Flex 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        mb={6} 
        direction={{ base: 'column', md: 'row' }} 
        gap={4}
      >
        <Text fontSize="xl" fontWeight="bold">보완점 리스트</Text>

        <HStack spacing={2} bg="gray.50" p={1} borderRadius="xl" overflowX="auto">
          {SUBJECT_TABS.map((tab) => {
            const active = selectedSubject === tab.value;
            return (
              <Button
                key={tab.value}
                size="sm"
                variant={active ? 'solid' : 'ghost'}
                colorScheme={active ? 'blue' : 'gray'}
                bg={active ? 'white' : 'transparent'}
                color={active ? 'blue.600' : 'gray.500'}
                shadow={active ? 'sm' : 'none'}
                borderRadius="lg"
                onClick={() => handleTabChange(tab.value)}
                _hover={{ bg: active ? 'white' : 'gray.100' }}
              >
                {tab.label}
              </Button>
            );
          })}
        </HStack>
      </Flex>

      <VStack spacing={3} align="stretch">
        {filteredList.length === 0 && !isAdding && (
          <Flex 
            h="120px" 
            justify="center" 
            align="center" 
            color="gray.400" 
            fontSize="sm"
            bg="gray.50"
            borderRadius="2xl"
            border="1px dashed"
            borderColor="gray.200"
          >
            등록된 보완점이 없습니다.
          </Flex>
        )}

        {filteredList.map((item) => (
          <WeaknessItem
            key={item.id}
            weakness={item}
            isEditing={editingId === item.id}
            onEditMode={() => handleEditClick(item.id)}
            onCancel={handleCancel}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}

        {isAdding ? (
          <WeaknessItem
            weakness={{
              id: 'temp-new',
              title: '',
              subject: selectedSubject,
              menteeId: '',
              inforId: '',
              contentId: '',
            }}
            isEditing={true}
            onEditMode={() => {}}
            onCancel={handleCancel}
            onSave={handleSave}
            onDelete={() => setIsAdding(false)} 
          />
        ) : (
          <AddWeaknessButton onClick={handleAddClick} />
        )}
      </VStack>
    </Box>
  );
};