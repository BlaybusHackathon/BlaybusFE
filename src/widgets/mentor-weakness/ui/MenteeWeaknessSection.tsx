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
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'ALL'>('ALL');
  const [weaknesses, setWeaknesses] = useState(MOCK_WEAKNESSES);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredList = useMemo(() => {
    if (selectedSubject === 'ALL') return weaknesses;
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
        subject: selectedSubject === 'ALL' ? 'OTHER' : selectedSubject,
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
    <Box bg="white" borderRadius="22px">
      <Flex
        direction="column"
        align="flex-start"
        mb={6}
        gap={4}
      >
        <Text fontSize="20px" fontWeight="700" color="#373E56">보완점 리스트</Text>

        <HStack spacing={2} overflowX="auto">
          <Button
            variant={selectedSubject === 'ALL' ? 'solid' : 'outline'} // 'ALL' if supported, logic adjustment needed below
            onClick={() => handleTabChange('ALL' as any)} // Temporary cast, handle logic below
            borderRadius="18px"
            p="4px 16px"
            bg={selectedSubject === 'ALL' ? '#53A8FE' : 'white'}
            color={selectedSubject === 'ALL' ? 'white' : '#A0A5B1'}
            borderColor={selectedSubject === 'ALL' ? '#53A8FE' : '#E2E4E8'}
            _hover={{ bg: selectedSubject === 'ALL' ? '#4297ED' : '#F7F8FA' }}
            fontWeight="600"
          >
            전체
          </Button>
          {SUBJECT_TABS.map((tab) => {
            const active = selectedSubject === tab.value;
            return (
              <Button
                key={tab.value}
                variant={active ? 'solid' : 'outline'}
                borderRadius="18px"
                p="4px 16px"
                bg={active ? '#53A8FE' : 'white'}
                color={active ? 'white' : '#A0A5B1'}
                borderColor={active ? '#53A8FE' : '#E2E4E8'}
                onClick={() => handleTabChange(tab.value)}
                _hover={{ bg: active ? '#4297ED' : '#F7F8FA' }}
                fontWeight="600"
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
              subject: selectedSubject === 'ALL' ? 'OTHER' : selectedSubject,
              menteeId: '',
              inforId: '',
              contentId: '',
            }}
            isEditing={true}
            onEditMode={() => { }}
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