import { useState, useMemo } from 'react';
import { Box, Flex, Text, Button, HStack, VStack } from '@chakra-ui/react';
import { Subject } from '@/shared/constants/subjects';
import { WeaknessItem } from './WeaknessItem';
import { AddWeaknessButton } from './AddWeaknessButton';
import { useParams } from 'react-router-dom';
import { useMenteeWeaknesses } from '@/features/weakness/model/useMenteeWeaknesses';
import { useWeaknessMutations } from '@/features/weakness/model/useWeaknessMutations';
import { studyContentApi } from '@/features/study-content/api/studyContentApi';

const SUBJECT_TABS: { value: Subject; label: string }[] = [
  { value: 'KOREAN', label: '국어' },
  { value: 'ENGLISH', label: '영어' },
  { value: 'MATH', label: '수학' },
];

export const MenteeWeaknessSection = () => {
  const { menteeId } = useParams();
  const { data: weaknesses, setData: setWeaknesses, refetch: refetchWeaknesses } = useMenteeWeaknesses(menteeId);
  const { create, update, remove } = useWeaknessMutations();

  const [selectedSubject, setSelectedSubject] = useState<Subject | 'ALL'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const list = useMemo(() => weaknesses ?? [], [weaknesses]);

  const filteredList = useMemo(() => {
    if (selectedSubject === 'ALL') return list;
    return list.filter((w) => w.subject === selectedSubject);
  }, [list, selectedSubject]);

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

  const handleSave = async ({
    id,
    title,
    file,
    existingContentId,
  }: {
    id: string;
    title: string;
    file?: File | null;
    existingContentId?: string;
  }) => {
    if (!menteeId) return;

    const fallbackSubject = selectedSubject === 'ALL' ? 'KOREAN' : selectedSubject;
    const target = isAdding ? undefined : list.find((w) => w.id === id);
    const resolvedSubject = isAdding ? fallbackSubject : (target?.subject ?? fallbackSubject);
    let contentId: string | number | undefined = existingContentId;
    let uploadedContent: { id: string; title: string; fileUrl?: string | null } | null = null;

    if (file) {
      try {
        const uploaded = await studyContentApi.upload(file, { title: file.name, subject: resolvedSubject });
        contentId = uploaded?.id;
        uploadedContent = uploaded ?? null;
      } catch (error) {
        console.error('Failed to upload study content', error);
        alert('파일 업로드에 실패했습니다.');
        return;
      }
    }

    if (!contentId) {
      alert('파일을 첨부해주세요.');
      return;
    }

    if (isAdding) {
      const subject = resolvedSubject;
      const created = await create.mutate({
        menteeId,
        subject,
        title,
        contentId,
      });
      if (created) {
        const merged = {
          ...created,
          contentId: created.contentId || (contentId ? String(contentId) : ''),
          menteeId: created.menteeId || menteeId,
          fileName: created.fileName ?? uploadedContent?.title ?? file?.name,
          fileUrl: created.fileUrl ?? uploadedContent?.fileUrl ?? undefined,
        };
        setWeaknesses((prev) => ([...(prev ?? []), merged]));
      }
      setIsAdding(false);
      refetchWeaknesses();
      return;
    }

    const updated = await update.mutate({
      weaknessId: id,
      payload: {
        menteeId,
        subject: resolvedSubject,
        title,
        contentId,
      },
    });

    if (updated) {
      setWeaknesses((prev) => (prev ?? []).map((w) => (w.id === id ? updated : w)));
    }
    setEditingId(null);
    refetchWeaknesses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    await remove.mutate(id);
    setWeaknesses((prev) => (prev ?? []).filter((w) => w.id !== id));
    if (editingId === id) setEditingId(null);
    refetchWeaknesses();
  };

  const handleTabChange = (subject: Subject | 'ALL') => {
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
            variant={selectedSubject === 'ALL' ? 'solid' : 'outline'}
            onClick={() => handleTabChange('ALL')}
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
              subject: selectedSubject === 'ALL' ? 'KOREAN' : selectedSubject,
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
        ) : selectedSubject === 'ALL' ? null : (
          <AddWeaknessButton onClick={handleAddClick} />
        )}
      </VStack>
    </Box>
  );
};
