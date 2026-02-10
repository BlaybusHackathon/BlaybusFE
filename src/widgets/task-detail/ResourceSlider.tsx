import { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  Button,
  Spinner,
  Center,
  VStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { DownloadIcon } from '@/shared/ui/icons';

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export interface StudyMaterial {
  id: string;
  title: string;
  url: string;
  label?: string; 
}

interface ResourceSliderProps {
  materials: StudyMaterial[];
}

const getFileType = (url: string = '', title: string = ''): 'PDF' | 'IMAGE' => {
  const checkString = (str: string) => {
    const lower = str.toLowerCase();
    if (lower.endsWith('.pdf')) return 'PDF';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].some(ext => lower.endsWith(ext))) {
        return 'IMAGE';
    }
    return null;
  };
  return checkString(url) || checkString(title) || 'IMAGE';
};

export const ResourceSlider = ({ materials }: ResourceSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!materials || materials.length === 0) return null;

  const currentItem = materials[currentIndex];
  const fileType = getFileType(currentItem?.url, currentItem?.title);
  const renderPdfError = () => (
    <Center h="400px" px={6} textAlign="center">
      <VStack spacing={3}>
        <Text fontSize="sm" color="gray.600">
          미리보기를 불러올 수 없습니다.
        </Text>
        <Text fontSize="xs" color="gray.500">
          새 탭에서 열거나 다운로드해서 확인해 주세요.
        </Text>
        <Button
          as="a"
          href={currentItem.url}
          target="_blank"
          rel="noreferrer"
          size="sm"
          variant="outline"
          colorScheme="blue"
        >
          새 탭에서 열기
        </Button>
      </VStack>
    </Center>
  );

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? materials.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === materials.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box w="full" borderRadius="20" overflow="hidden">
      
      <Flex bg={'white'} justify="space-between" align="center" borderRadius={10} mb={2} shadow={'sm'}>
        <Flex w={'full'} align={'center'} justify={'space-between'} px={4} py={5} borderBottom="1px solid" borderColor="gray.100">
          {currentItem.label && (
            <Text fontSize="sm" fontWeight="semibold" color="#373E56" mb={0.5}>
              {currentItem.label}
            </Text>
          )}
          <Text fontSize="xs" fontWeight="medium" color="#70707B" noOfLines={1}>
            {currentItem.title}
          </Text>
          <Button 
            as="a" 
            h={'fit-content'}
            href={currentItem.url} 
            download 
            p={0}
            colorScheme="blue" 
            variant="outline" 
            leftIcon={<DownloadIcon />}
            border={'none'}
            flexShrink={0}
            _hover={{ bg: 'white' }}
          />
        </Flex>
      </Flex>

      <Box position="relative" w="full" bg="white" borderRadius={10} overflow="hidden">
        <Box 
          w="full" 
          aspectRatio={3 / 4} 
          maxH="80vh"         
          overflowY="auto"    
          position="relative" 
          bg="white"
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '10px' },
          }}
        >
          
          {fileType === 'IMAGE' && (
            <Flex w="full" h="full" align="center" justify="center" bg="gray.50">
              <Image
                src={currentItem.url}
                alt={currentItem.title}
                w="full"
                h="full"
                objectFit="contain" 
              />
            </Flex>
          )}

          {fileType === 'PDF' && (
            <Box w="full">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={currentItem.url}
                  defaultScale={SpecialZoomLevel.PageWidth} 
                  renderError={renderPdfError}
                  renderLoader={() => (
                    <Center h="400px">
                      <Spinner size="xl" color="blue.500" />
                    </Center>
                  )}
                />
              </Worker>
            </Box>
          )}
        </Box>

        {materials.length > 1 && (
          <>
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon boxSize={8} />}
              position="absolute"
              left={2}
              top="50%"
              transform="translateY(-50%)"
              onClick={handlePrev}
              colorScheme="blackAlpha"
              variant="solid"
              isRound
              zIndex={10}
              display={{ base: 'none', md: 'flex' }}
            />
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon boxSize={8} />}
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              onClick={handleNext}
              colorScheme="blackAlpha"
              variant="solid"
              isRound
              zIndex={10}
              display={{ base: 'none', md: 'flex' }} 
            />
          </>
        )}

        {fileType !== 'PDF' && (
          <Flex position="absolute" bottom={4} justify="center" w="full" zIndex={10} pointerEvents="none">
            <Box bg="blackAlpha.600" px={3} py={1} borderRadius="full">
              <Text color="white" fontSize="sm" fontWeight="medium">
                {currentIndex + 1} / {materials.length}
              </Text>
            </Box>
          </Flex>
        )}

      </Box>
    </Box>
  );
};
