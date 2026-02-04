import { useState, useRef, useEffect } from 'react';
import { 
  Box, Flex, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, 
  Icon, Textarea, Button, Input 
} from '@chakra-ui/react';
import { 
  AttachmentIcon, EditIcon, DeleteIcon, CheckIcon, CloseIcon, SmallCloseIcon 
} from '@chakra-ui/icons';
import { Weakness } from '@/entities/weakness/types';

interface Props {
  weakness: Weakness; 
  isEditing: boolean; 
  onEditMode: () => void; 
  onCancel: () => void;  
  onSave: (id: string, title: string, fileName?: string) => void;
  onDelete: (id: string) => void; 
}

const MoreIcon = () => (
  <Icon viewBox="0 0 24 24" w="20px" h="20px" fill="gray.400">
    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </Icon>
);

export const WeaknessItem = ({ 
  weakness, isEditing, onEditMode, onCancel, onSave, onDelete 
}: Props) => {
  const [title, setTitle] = useState(weakness.title);
  const [fileName, setFileName] = useState(weakness.fileName || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setTitle(weakness.title);
      setFileName(weakness.fileName || '');
    }
  }, [isEditing, weakness]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveClick = () => {
    if (!title.trim()) {
      alert('보완점 내용을 입력해주세요.');
      return;
    }
    onSave(weakness.id, title, fileName);
  };

  return (
    <Box
      bg="gray.50"
      p={5}
      borderRadius="2xl"
      position="relative"
      transition="all 0.2s"
      border="1px solid"
      borderColor={isEditing ? "blue.200" : "transparent"}
      _hover={{ bg: isEditing ? 'white' : 'gray.100' }}
    >
      <Flex align="flex-start" gap={3}>
        <Box w="8px" h="8px" borderRadius="full" bg="pink.400" mt={2} flexShrink={0} />

        <Box flex={1}>
          {isEditing ? (
            <Flex direction="row" gap={3}>
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="보완점 내용을 입력해주세요."
                size="sm"
                resize="none"
                borderRadius="md"
                bg="white"
                rows={2}
                autoFocus
              />

              <Flex align="center" gap={2}>
                {fileName ? (
                  <Flex 
                    align="center" 
                    bg="gray.100" 
                    px={3} 
                    py={1} 
                    borderRadius="full" 
                    gap={2}
                  >
                    <AttachmentIcon w={3} h={3} color="gray.500" />
                    <Text fontSize="xs" color="gray.600" noOfLines={1} maxW="200px">
                      {fileName}
                    </Text>
                    <Icon 
                      as={SmallCloseIcon} 
                      w={4} h={4} 
                      color="gray.500" 
                      cursor="pointer" 
                      onClick={handleRemoveFile}
                      _hover={{ color: "red.500" }}
                    />
                  </Flex>
                ) : (
                  <Button 
                    size="xs" 
                    leftIcon={<AttachmentIcon />} 
                    variant="outline" 
                    colorScheme="gray"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    자료 첨부
                  </Button>
                )}
                <Input 
                  type="file" 
                  display="none" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Flex>
            </Flex>
          ) : (
            <Flex align="center" justify="space-between" h="full" minH="24px">
              <Text fontSize="md" fontWeight="bold" color="gray.700" noOfLines={1} mr={4}>
                {weakness.title}
              </Text>

              {weakness.fileName && (
                <Flex align="center" gap={1} color="gray.500" flexShrink={0}>
                  <AttachmentIcon w={3} h={3} />
                  <Text fontSize="xs" noOfLines={1} maxW="150px">
                    {weakness.fileName}
                  </Text>
                </Flex>
              )}
            </Flex>
          )}
        </Box>

        <Box>
          {isEditing ? (
            <Flex gap={1} ml={2}>
               <IconButton
                icon={<CloseIcon />}
                size="xs"
                variant="ghost"
                colorScheme="gray"
                aria-label="취소"
                onClick={onCancel}
              />
              <IconButton
                icon={<CheckIcon />}
                size="xs"
                colorScheme="blue"
                aria-label="저장"
                onClick={handleSaveClick}
              />
            </Flex>
          ) : (
            <Menu isLazy placement="bottom-end">
              <MenuButton
                as={IconButton}
                icon={<MoreIcon />}
                variant="ghost"
                size="sm"
                aria-label="더보기"
              />
              <MenuList minW="120px" fontSize="sm">
                <MenuItem icon={<EditIcon />} onClick={onEditMode}>
                  수정
                </MenuItem>
                <MenuItem icon={<DeleteIcon />} onClick={() => onDelete(weakness.id)} color="red.500">
                  삭제
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>
    </Box>
  );
};