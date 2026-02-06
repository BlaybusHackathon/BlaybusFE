import { useState, useEffect } from 'react';
import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon , ChatIcon} from '@chakra-ui/icons'; 
import { motion, PanInfo } from 'framer-motion';

import { FeedbackOverlay } from '@/features/task-feedback/ui/FeedbackOverlay';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { UserRole } from '@/shared/constants/enums';

export interface SubmissionImageData {
  id: string;
  imageUrl: string;
}

interface ImageSliderProps {
  images: SubmissionImageData[];
  taskId: string;
  currentUserId: string;
  userRole: UserRole;
  onDelete?: (imageId: string) => void;
}

export const ImageSlider = ({ images, taskId, currentUserId, userRole, onDelete }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const store = useTaskFeedbackStore();
  
  const isSubmissionMode = !!onDelete;
  const isCreateMode = !isSubmissionMode && store.commentMode === 'create';

  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(images.length - 1);
    }
  }, [images.length, currentIndex]);

  const handlePrev = (e?: React.MouseEvent | any) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    if (!isSubmissionMode) resetMode();
  };

  const handleNext = (e?: React.MouseEvent | any) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    if (!isSubmissionMode) resetMode();
  };

  const resetMode = () => {
    store.setCommentMode('view');
    store.setPendingPosition(null);
  };

  const toggleFeedbackMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCreateMode) {
      store.setCommentMode('view');
      store.setPendingPosition(null);
    } else {
      store.setCommentMode('create');
    }
  };

  const onDragEnd = (_: any, info: PanInfo) => {
    const SWIPE_THRESHOLD = 50;
    if (info.offset.x < -SWIPE_THRESHOLD) {
      handleNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      handlePrev();
    }
  };

  if (!images || images.length === 0) {
    return (
      <Box h="400px" bg="gray.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">이미지가 없습니다.</Text>
      </Box>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <Box 
      position="relative" 
      w="full"
      h={{ base: 'fit-content'}}
      borderRadius="xl" 
      userSelect="none"
      display="flex"          
      justifyContent="center" 
      alignItems={{ base: 'flex-start', md: 'center' }}
      pb={16}
    >
      <Box 
        as={motion.div}
        position="relative" 
        h={{ base: 'auto', md: 'full' }} 
        w={{ base: 'full', md: 'auto' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
        cursor={isCreateMode ? "crosshair" : "grab"}
        whileTap={{ cursor: isCreateMode ? "crosshair" : "grabbing" }}
      >
        <Image
          src={currentImage.imageUrl}
          alt={`Submission ${currentIndex + 1}`}
          h={{ base: 'auto', md: '100%' }}
          w={{ base: '100%', md: 'auto' }}
          maxW="100%"
          display="block"
          pointerEvents="none" 
        />
        
        {!isSubmissionMode && (
          <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={10}>
              <FeedbackOverlay 
                  taskId={taskId}
                  imageId={currentImage.id}
                  currentUserId={currentUserId}
                  userRole={userRole} 
              />
          </Box>
        )}
      </Box>

      {/* --- 컨트롤러 영역 --- */}


      {isCreateMode && (
         <Box position="absolute" top={4} left="50%" transform="translateX(-50%)" zIndex={30} pointerEvents="none">
             <Box bg="blue.500" color="white" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="bold" boxShadow="lg">
                이미지를 클릭하여 피드백을 남겨주세요
             </Box>
         </Box>
      )}

      <Box position="absolute" top={4} right={4} zIndex={30}>
        {isSubmissionMode ? (
            <IconButton
                aria-label="Delete image"
                icon={<CloseIcon />} 
                onClick={() => onDelete(currentImage.id)}
                colorScheme="blackAlpha"
                variant="solid"
                isRound
                size="md"
                boxShadow="md"
            />
        ) : (
            userRole === "MENTOR" && (

                null
            )
        )}
      </Box>      

        {userRole === "MENTOR" && (
            <Box position="absolute" bottom={-16} right={0} zIndex={5}>
                <IconButton
                    aria-label="Comments"
                    icon={<ChatIcon boxSize={5} color="white" />}
                    onClick={toggleFeedbackMode}
                    isRound
                    w="48px" h="48px"
                    bg="#3B82F6"
                    _hover={{ bg: 'blue.600' }}
                    boxShadow="md"
                />
            </Box>
        )}


      {images.length > 1 && (
        <>
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon boxSize={8} color={'black'}/>}
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            onClick={handlePrev}
            colorScheme="whiteAlpha"
            isRound
            size="lg"
            zIndex={20}
            boxShadow="dark-lg"
            display={{ base: 'none', md: 'flex' }} 
          />
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon boxSize={8} color={'black'}/>}
            position="absolute"
            right={4}
            top="50%"
            transform="translateY(-50%)"
            onClick={handleNext}
            colorScheme="whiteAlpha"
            isRound
            size="lg"
            zIndex={20}
            boxShadow="dark-lg"
            display={{ base: 'none', md: 'flex' }}
          />
        </>
      )}

      <Flex 
        position="absolute" 
        bottom={4} 
        justify="center" 
        align="center"
        w="full"
        zIndex={30}
        pointerEvents="none"
      >
        <Box bg="blackAlpha.600" px={3} py={1} borderRadius="full" backdropFilter="blur(4px)">
          <Text color="white" fontSize="sm" fontWeight="medium">
            {currentIndex + 1} / {images.length}
          </Text>
        </Box>
      </Flex>
      

    </Box>
  );
};