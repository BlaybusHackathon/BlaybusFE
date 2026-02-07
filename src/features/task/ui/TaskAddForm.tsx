import { useState } from 'react';
import { HStack, Button, Menu, MenuList, MenuItem, MenuButton } from '@chakra-ui/react';
import { Input } from '@/shared/ui/Input';
import { Subject, SUBJECT_LABELS } from '@/shared/constants/subjects';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface TaskAddFormProps {
  onSubmit: (data: { title: string; subject: Subject }) => void;
  onCancel: () => void;
}

export const TaskAddForm = ({ onSubmit }: TaskAddFormProps) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('OTHER');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), subject });
    setTitle('');
  };

  return (
    <HStack justify={'space-between'} gap={2} p={4} bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.100">
      <Input
        flex={1}
        fontSize={'sm'}
        border={'none'}
        placeholder="목표를 입력해 주세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        _placeholder={{ color: 'gray.400' }}
        _focus={{
          border: 'none',
          boxShadow: 'none'
        }}
        sx={{
          '&:focus': {
            borderBottom: 'none !important'
          }
        }}
      />

      <HStack gap={2} justify="flex-end" flexShrink={0}>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            w={20}
            py={4}
            variant="outline"
            borderRadius="xl"
            borderColor="blue.400"
            borderWidth="2px"
            bg="white"
            fontWeight="normal"
            fontSize="sm"
            _hover={{
              borderColor: 'blue.500',
              bg: 'white'
            }}
            _active={{
              borderColor: 'blue.600',
              bg: 'white'
            }}
          >
            {SUBJECT_LABELS[subject]}
          </MenuButton>
          <MenuList
            borderRadius="2xl"
            borderColor="blue.400"
            borderWidth="2px"
            boxShadow="lg"
            py={0}
            px={0}
            overflow="hidden"
            minW="fit-content"
          >
            {Object.entries(SUBJECT_LABELS).map(([key, label]) => (
              <MenuItem
                justifyContent="center"
                w={20}
                py={2}
                key={key}
                onClick={() => setSubject(key as Subject)}
                fontSize="sm"
                fontWeight={"normal"}
                minH="auto"
                _hover={{
                  bg: 'blue.50'
                }}
              >
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Button fontSize={'3xl'} fontWeight="reguler" color={'gray.500'} bg={'white'} onClick={handleSubmit} flexShrink={0}>
          +
        </Button>
      </HStack>
    </HStack>
  );
};