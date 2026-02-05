import { useState } from 'react';
import { Box, Flex, IconButton, Image, Text, Tooltip } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, CloseIcon } from '@chakra-ui/icons';
import { motion, PanInfo } from 'framer-motion'; // [추가] 모션 및 드래그 타입

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
}

export const ImageSlider = ({ images, taskId, currentUserId, userRole }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const store = useTaskFeedbackStore();
  const isCreateMode = store.commentMode === 'create';

  // [수정] 이벤트 타입 호환성을 위해 any 또는 React.MouseEvent 허용
  const handlePrev = (e?: React.MouseEvent | any) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetMode();
  };

  const handleNext = (e?: React.MouseEvent | any) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetMode();
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

  // [추가] 스와이프 종료 핸들러
  const onDragEnd = (_: any, info: PanInfo) => {
    const SWIPE_THRESHOLD = 50; // 50px 이상 움직이면 스와이프로 인식

    if (info.offset.x < -SWIPE_THRESHOLD) {
      // 왼쪽으로 드래그 -> 다음 이미지
      handleNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      // 오른쪽으로 드래그 -> 이전 이미지
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
      h={{ base: 'auto', md: '85vh' }}
      bg="gray.900" 
      borderRadius="xl" 
      border="1px solid" 
      borderColor="gray.200"
      userSelect="none"
      display="flex"          
      justifyContent="center" 
      alignItems={{ base: 'flex-start', md: 'center' }}
      overflow="hidden"
    >
      {/* [핵심 1] 스와이프 감지 영역 (motion.div)
        - Box 대신 motion.div를 사용하여 드래그 이벤트를 감지합니다.
        - drag="x": 가로 드래그만 허용
        - dragConstraints: 드래그 후 제자리로 돌아오게 설정 (슬라이더 느낌)
      */}
      <Box 
        as={motion.div}
        position="relative" 
        h={{ base: 'auto', md: 'full' }} 
        w={{ base: 'full', md: 'auto' }}
        
        // --- Framer Motion Props ---
        drag="x"
        dragConstraints={{ left: 0, right: 0 }} // 드래그 범위를 제한하여 탄성 효과만 줌
        dragElastic={0.1} // 탄성 정도 (쫄깃한 느낌)
        onDragEnd={onDragEnd}
        // ---------------------------
        
        // 드래그 중 커서 변경
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
        
        {/* 오버레이는 드래그 이벤트 전파를 막지 않아야 함 */}
        <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={10}>
            <FeedbackOverlay 
                taskId={taskId}
                imageId={currentImage.id}
                currentUserId={currentUserId}
                userRole={userRole} 
            />
        </Box>
      </Box>

      {/* --- 컨트롤러 영역 --- */}
      
      {isCreateMode && (
         <Box 
            position="absolute" 
            top={4} 
            left="50%" 
            transform="translateX(-50%)" 
            zIndex={30}
            pointerEvents="none"
         >
             <Box 
                bg="blue.500" 
                color="white" 
                px={4} 
                py={2} 
                borderRadius="full" 
                fontSize="sm"
                fontWeight="bold"
                boxShadow="lg"
              >
                이미지를 클릭하여 피드백을 남겨주세요
              </Box>
         </Box>
      )}

      {userRole === "MENTOR" && (
        <Box position="absolute" top={4} right={4} zIndex={30}>
            <Tooltip label={isCreateMode ? "작성 모드 종료" : "피드백 남기기"} hasArrow placement='left'>
                <IconButton
                aria-label="Toggle feedback mode"
                icon={isCreateMode ? <CloseIcon /> : <EditIcon />}
                onClick={toggleFeedbackMode}
                colorScheme={isCreateMode ? "red" : "blue"}
                isRound
                size="lg"
                boxShadow="xl"
                border="2px solid white"
                />
            </Tooltip>
        </Box>
      )}

      {/* [핵심 2] 네비게이션 버튼: 모바일에서는 숨김 */}
      {images.length > 1 && (
        <>
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon boxSize={8} />}
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
            // 모바일(base)에서 숨기고, 데스크톱(md)에서 보임
            display={{ base: 'none', md: 'flex' }} 
          />
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon boxSize={8} />}
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