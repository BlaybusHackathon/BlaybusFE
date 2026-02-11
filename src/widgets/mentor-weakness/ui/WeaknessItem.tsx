import { useState, useRef } from 'react';
import {
  Box, Flex, Text, IconButton, Menu, MenuButton, MenuList, MenuItem,
  Icon, Textarea,  Input
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import {
   CheckIcon, CloseIcon, AddIcon
} from '@chakra-ui/icons';
import { Weakness } from '@/entities/weakness/types';
import { ModifyIcon, MoreIcon } from '@/shared/ui/icons';
import { DeleteIcon } from '@/shared/ui/icons';

interface Props {
  weakness: Weakness;
  isEditing: boolean;
  onEditMode: () => void;
  onCancel: () => void;
  onSave: (args: { id: string; title: string; file?: File | null; existingContentId?: string }) => void;
  onDelete: (id: string) => void;
}


export const WeaknessItem = ({
  weakness, isEditing, onEditMode, onCancel, onSave, onDelete
}: Props) => {
  const [title, setTitle] = useState(weakness.title);
  const [fileName, setFileName] = useState(weakness.fileName || '');
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditMode = () => {
    setTitle(weakness.title);
    setFileName(weakness.fileName || '');
    setFile(null);
    onEditMode();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      setFileName(file.name);

      if (!isEditing) {
        onSave({ id: weakness.id, title: weakness.title, file, existingContentId: weakness.contentId });
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveClick = () => {
    if (!title.trim()) {
      alert('보완점 내용을 입력해주세요.');
      return;
    }
    onSave({ id: weakness.id, title, file, existingContentId: weakness.contentId });
  };

  return (
    <Box
      bg={{base:'white',md:"#F9F9FB"}}
      p="24px 32px"
      borderRadius="22px"
      position="relative"
      transition="all 0.2s"
      border="1px solid"
      borderColor={isEditing ? "blue.200" : "transparent"}
      _hover={{ bg: isEditing ? 'white' : 'gray.100' }}
    >
      <Flex align="flex-start" gap={3} justifyContent="center" alignItems="center">

        <Box flex={1}>
          {isEditing ? (
            <Flex direction="row" gap={3} justify={'space-between'}>
              <Textarea
                as={TextareaAutosize}
                value={title}
                p={0}
                maxW={'454px'}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="보완점 내용을 입력해주세요."
                border={'none'}
                borderBottom="1px solid #9B9BA4"
                borderRadius={'none'}
                size="md"
                resize="none"
                minRows={1}
                autoFocus
                _focus={{ 
                  border: 'none', 
                  borderBottom: '1px solid #000', 
                  boxShadow: 'none' 
                }}
              />

              <Flex align="center" gap={2}>
                {fileName ? (
                  <Flex
                    align="center"
                    px={3}
                    py={1}
                    gap={2}
                  >
                    <Text fontSize="xs" color="gray.600" noOfLines={1} maxW="200px">
                      {fileName}
                    </Text>
                    <Icon
                      as={CloseIcon}
                      w={'14px'} h={'14px'}
                      color="gray.500"
                      cursor="pointer"
                      onClick={handleRemoveFile}
                      _hover={{ color: "red.500" }}
                    />
                  </Flex>
                ) : (
                  <Flex
                    align="center"
                    gap={1}
                    mr={2}
                    cursor="pointer"
                    color="#A0A5B1"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    _hover={{ color: '#53A8FE' }}
                  >
                    <AddIcon w={3} h={3}/>
                    <Text fontSize="14px" fontWeight="500">파일 추가</Text>
                  </Flex>
                )}

              </Flex>
            </Flex>
          ) : (
            <Flex align="center" justify="space-between" h="full" minH="24px" w="full">
              {/* Left Side: Title */}
              <Flex align="center" flex={1} mr={4}>
                <Text fontSize="16px" fontWeight="600" color="#373E56" noOfLines={1}>
                  {weakness.title}
                </Text>
              </Flex>

              {/* Right Side: File Name or Add Button */}
              {weakness.fileName ? (
                <Flex align="center" gap={2} mr={2}>
                  <Text fontSize="14px" color="#7E7E7E" noOfLines={1} maxW="200px">
                    {weakness.fileName}
                  </Text>
                </Flex>
              ) : (
                <Flex
                  align="center"
                  gap={1}
                  mr={2}
                  cursor="pointer"
                  color="#A0A5B1"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  _hover={{ color: '#53A8FE' }}
                >
                  <AddIcon w={3} h={3}/>
                  <Text fontSize="14px" fontWeight="500">파일 추가</Text>
                </Flex>
              )}
            </Flex>
          )}

          {/* Hidden Input moved outside conditional */}
          <Input
            type="file"
            display="none"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Box>

        <Box alignSelf="flex-start" ml={2}>
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
              <MenuList minW="98px" fontSize="md" borderRadius={22} pl={1}>
                <MenuItem gap={2} onClick={handleEditMode} color="#373E56" _hover={{ color: "#53A8FE" }} w={"fit-content"}>
                  수정
                  <ModifyIcon />
                </MenuItem>
                <MenuItem gap={2} onClick={() => onDelete(weakness.id)}  color="#373E56" _hover={{ color: "#53A8FE" }} w={"fit-content"}>
                  삭제
                  <DeleteIcon />
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
