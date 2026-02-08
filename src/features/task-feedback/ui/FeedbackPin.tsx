import { RefObject, useRef, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { TaskFeedback } from '@/entities/task-feedback/types';
import { extractPreviewText, getPinPositionStyles } from '../model/feedbackUtils';

interface FeedbackPinProps {
  feedback: TaskFeedback;
  containerRef: RefObject<HTMLDivElement | null>;
  isDraggable: boolean;
  isDimmed: boolean;
  isHidden?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onClick: () => void;
}

const MotionBox = motion(Box);

export const FeedbackPin = ({ 
  feedback, 
  containerRef,
  isDraggable,
  isDimmed,
  isHidden = false,
  onMouseEnter, 
  onMouseLeave, 
  onPositionChange,
  onClick 
}: FeedbackPinProps) => {
  const previewText = extractPreviewText(feedback.content);
  
  const controls = useAnimation();
  
  const isMovedRef = useRef(false);

  const { containerStyle, visualStyle, pointerStyle, flexDirection, transformOrigin } = getPinPositionStyles(
    feedback.xPos, 
    feedback.yPos
  );

  useEffect(() => {
    const targetOpacity = isHidden ? 0 : (isDimmed ? 0.4 : 1);
    controls.start({
      x: 0, 
      y: 0, 
      scale: 1,
      opacity: targetOpacity,
      filter: isDimmed ? 'grayscale(80%)' : 'grayscale(0%)', 
      transition: { duration: 0.2 }
    });
  }, [feedback.xPos, feedback.yPos, isDimmed, isHidden, controls]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = info.offset.x;
    const deltaY = info.offset.y;

    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;

    let newX = feedback.xPos + deltaXPercent;
    let newY = feedback.yPos + deltaYPercent;

    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    onPositionChange(feedback.id, newX, newY);
    
    controls.start({ x: 0, y: 0, transition: { duration: 0 } });
  };

  return (
    <MotionBox
      layoutId={`pin-${feedback.id}`}
      style={containerStyle} 
      
      animate={controls}
      
      zIndex={isDimmed ? 5 : 50} 
      pointerEvents={isHidden ? 'none' : 'auto'}
      
      drag={isDraggable}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={containerRef as RefObject<HTMLElement>} 
      
      onPointerDown={() => { isMovedRef.current = false; }}
      onDragStart={() => { isMovedRef.current = true; }}
      onDragEnd={handleDragEnd}
      
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      
      whileDrag={{ zIndex: 100}} 

      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMovedRef.current) return;
        onClick();
      }}

      initial={{ scale: 0, opacity: 0 }}
      
      exit={{ scale: 0, opacity: 0 }}
      transformOrigin={transformOrigin}
    >
      <Box
        style={visualStyle}
        bg="white"
        borderRadius="12px"
        boxShadow={isDimmed ? "none" : "0px 4px 12px rgba(0, 0, 0, 0.15)"} 
        border="1px solid"
        borderColor="gray.100"
        transform={isDimmed ? 'scale(0.95)' : 'scale(1)'}
        transition="transform 0.2s"
      >
        <Box 
          px={3} 
          py={2} 
          display="flex" 
          alignItems="center" 
          gap={2} 
          maxW="200px"
          flexDirection={flexDirection} 
          userSelect="none"
        >
          <Box color={isDimmed ? "gray.400" : "blue.500"} minW="16px" transition="color 0.2s">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </Box>

          <Text fontSize="xs" fontWeight="bold" color="gray.800" noOfLines={1}>
            {previewText}
          </Text>
        </Box>

        <Box
          position="absolute"
          w="12px"
          h="12px"
          bg="white"
          borderRadius="2px"
          zIndex={-1}
          boxShadow={isDimmed ? "none" : "-1px 1px 1px rgba(0,0,0,0.05)"}
          style={pointerStyle}
        />
      </Box>
    </MotionBox>
  );
};
